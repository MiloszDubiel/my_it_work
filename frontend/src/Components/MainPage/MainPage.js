import styles from "./MainPage.module.css";
import Navbar from "../NavBar/NavBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import OfferInfo from "../Offert/OfferInfo";

const safeJsonParse = (value, fallback = null) => {
  if (!value || typeof value !== "string") return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const MainPage = () => {
  const [offers, setOffers] = useState([]);
const [selectedOffer, setSelectedOffer] = useState(null);
  const userData = JSON.parse(
    sessionStorage.getItem("user-data") || localStorage.getItem("user-data"),
  );

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job-offerts");

        let random = Math.floor(Math.random() * res.data.length - 4);

        setOffers(res.data.slice(random, random + 3));
      } catch (err) {
        console.error("Błąd podczas pobierania ofert:", err);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Znajdź swoją wymarzoną pracę IT</h1>
          <p style={{ textAlign: "center" }}>
            Przeglądaj oferty pracy, poznaj firmy i aplikuj w kilka kliknięć.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/job-offers" className={styles.btnPrimary}>
              Przeglądaj oferty
            </Link>

            {!userData && (
              <Link to="/register" className={styles.btnSecondary}>
                Dołącz teraz
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className={styles.jobsSection}>
        <h2>Najnowsze oferty</h2>
        <div className={styles.jobsGrid}>
  {offers?.map((el) => (
    <div key={el.id} className={styles.jobCard}>
      <h3>{el.title}</h3>
      <p>{el.companyName}</p>
      <span>
        {safeJsonParse(el.contractType)?.[0] || "Nie podano"}
      </span>

      <div className={styles.divButton}>
        <button
          className={styles.detailsBtn}
          onClick={() => setSelectedOffer(el)}
        >
          Szczegóły
        </button>
      </div>
    </div>
  ))}
</div>

{selectedOffer && (
  <OfferInfo
    offer={selectedOffer}
    onClose={() => setSelectedOffer(null)}
  />
)}
      </section>
    </div>
  );
};

export default MainPage;
