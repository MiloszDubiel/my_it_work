import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(
    sessionStorage.getItem("user-data") || localStorage.getItem("user-data"),
  );

  const authHeaders = {
    Authorization: `Bearer ${
      sessionStorage.getItem("token") || localStorage.getItem("token")
    }`,
  };

  const fetchFavorites = async () => {
    if (!userData?.id) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/job-offerts/favorites/${userData.id}`,
        { headers: authHeaders },
      );

      setFavorites(res.data);
    } catch (err) {
      console.error("Błąd pobierania ulubionych:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(favorites);

  useEffect(() => {
    if (userData?.id) fetchFavorites();
  }, [userData?.id]);

  const isFavorite = (id) => favorites.some((o) => o.id === id);

  const toggleFavorite = async (offer) => {
    if (!userData?.id || !offer?.id) return;

    console.log(isFavorite(offer.id));

    try {
      if (isFavorite(offer.id)) {
        await axios.delete(
          `http://localhost:5000/api/job-offerts/favorites/${userData.id}/${offer.id}`,
          { headers: authHeaders },
        );
        setFavorites((prev) => prev.filter((o) => o.id !== offer.id));
      } else {
        await axios.post(
          "http://localhost:5000/api/job-offerts/favorites",
          { user_id: userData.id, offer_id: offer.id },
          { headers: authHeaders },
        );
        setFavorites((prev) => [...prev, offer]);
      }
    } catch (err) {
      console.error("Błąd toggle favorite:", err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
