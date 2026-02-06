import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const getToken = () =>
    sessionStorage.getItem("token") || localStorage.getItem("token");



useEffect(() => {
  const readUser = () => {
    const data =
      JSON.parse(sessionStorage.getItem("user-data")) ||
      JSON.parse(localStorage.getItem("user-data"));

    setUserData(data || null);
  };

  readUser(); 
  window.addEventListener("storage-changed", readUser);
  return () => window.removeEventListener("storage-changed", readUser);
}, []);

  const fetchFavorites = async () => {
    const token = getToken();
    console.log(userData?.id )

    if (!userData?.id || !token) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/job-offerts/favorites/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
        console.error("Błąd pobierania ulubionych:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userData?.id]);

  const isFavorite = (id) =>
    Array.isArray(favorites) && favorites.some((o) => o.id === id);

  const toggleFavorite = async (offer) => {
    const token = getToken();
    if (!userData?.id || !offer?.id || !token) return;

    try {
      if (isFavorite(offer.id)) {
        await axios.delete(
          `http://localhost:5000/api/job-offerts/favorites/${userData.id}/${offer.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFavorites((prev) => prev.filter((o) => o.id !== offer.id));
      } else {
        await axios.post(
          "http://localhost:5000/api/job-offerts/favorites",
          { user_id: userData.id, offer_id: offer.id },
          { headers: { Authorization: `Bearer ${token}` } },
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