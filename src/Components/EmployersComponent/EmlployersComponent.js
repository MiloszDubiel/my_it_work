import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./employers.module.css";
import SortButton, { Sort } from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";
import Filter from "../FilterComponent/Filter";

const OFFERS_PER_PAGE = 9;

const EmployersComponent = () => {
  const [offers, setOffers] = useState([]);
  const [sortedOffers, setSortedOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =====================
     FETCH DATA
  ====================== */
  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("http://localhost:5000/api/employers", {
          timeout: 10000,
        });

        if (isMounted) {
          const data = Array.isArray(res.data) ? res.data : [];
          setOffers(data);
          setSortedOffers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Nie udało się pobrać ofert.");
          console.error("Błąd podczas pobierania ofert:", err);
        }
      } finally {
        isMounted && setLoading(false);
      }
    };

    fetchOffers();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =====================
     SORT EVENT LISTENER
  ====================== */
  useEffect(() => {
    const handleSortChange = () => {
      const type = sessionStorage.getItem("sort-option");
      setSortedOffers((prev) => Sort([...prev], type));
      setCurrentPage(1);
    };

    window.addEventListener("changed-sort-option", handleSortChange);

    return () => {
      window.removeEventListener("changed-sort-option", handleSortChange);
    };
  }, []);

  /* =====================
     PAGINATION (MEMO)
  ====================== */
  const totalPages = useMemo(
    () => Math.ceil(sortedOffers.length / OFFERS_PER_PAGE),
    [sortedOffers]
  );

  const currentOffers = useMemo(() => {
    const start = (currentPage - 1) * OFFERS_PER_PAGE;
    return sortedOffers.slice(start, start + OFFERS_PER_PAGE);
  }, [sortedOffers, currentPage]);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* =====================
     HELPERS
  ====================== */
  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  /* =====================
     RENDER
  ====================== */
  return (
    <>
      <Navbar />
      <Filter employersPage />

      <div className={styles.container}>
        <h1>Pracodawcy</h1>
        <SortButton employersPage />

        {loading && <p>Ładowanie ofert…</p>}
        {error && <p className={styles.noOffers}>{error}</p>}

        {!loading && !error && (
          <div className={styles.offersList}>
            {currentOffers.length > 0 ? (
              currentOffers.map((offer) => {
                const technologies = safeParse(offer.technologies)?.[0] || [];
                const locations = safeParse(offer.locations)?.[0];

                return (
                  <div className={styles.offerRow} key={offer.id || offer._id}>
                    <div className={styles.logoSection}>
                      <img
                        src={offer.img || "/default-company.png"}
                        alt={offer.companyName || "Firma"}
                        className={styles.companyImg}
                        onError={(e) =>
                          (e.currentTarget.src = "/default-company.png")
                        }
                      />
                    </div>

                    <div className={styles.infoSection}>
                      <h3>{offer.title || "Brak tytułu"}</h3>
                      <p className={styles.company}>{offer.companyName}</p>

                      {offer.location && (
                        <p className={styles.location}>{offer.location}</p>
                      )}

                      <div className={styles.tags}>
                        <div className={styles.technologies}>
                          {technologies.slice(0, 2).map((tech, i) => (
                            <span key={i} className={styles.tag}>
                              {tech}
                            </span>
                          ))}

                          {technologies.length > 2 && (
                            <p className={styles.item}>i więcej…</p>
                          )}
                        </div>

                        {locations && (
                          <div className={styles.locations}>
                            <p className={styles.item}>Lokalizacje:</p>
                            <span className={styles.tag}>{locations}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {offer.link && (
                        <a
                          href={offer.link}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.detailsBtn}
                        >
                          Szczegóły
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noOffers}>Brak dostępnych firm.</p>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ‹
            </button>
            <span style={{ fontSize: 12 }}>
              Strona {currentPage} z {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployersComponent;
