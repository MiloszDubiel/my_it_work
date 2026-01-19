import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./employers.module.css";
import SortButton, { Sort } from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";
import Filter from "../Filter/Filter";
import EmployerInfo from "../Employers/EmployerInfo";

const OFFERS_PER_PAGE = 9;

const EmployersComponent = () => {
  const [offers, setOffers] = useState([]);
  const [sortedOffers, setSortedOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const open = useCallback((id) => {
    if (id)
      document.querySelector(`#company-info-${id}`).style.display = "flex";
  });

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
                console.log(offer);
                const technologies = safeParse(offer.technologies)?.[0] || [];
                const locations = safeParse(offer.locations)?.[0];

                return (
                  <>
                    <EmployerInfo companyOwner={offer.owner_id} />
                    <div
                      className={styles.offerRow}
                      key={offer.id || offer._id}
                    >
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
                        <h3>{offer.companyName}</h3>
                        <p className={styles.company}>{offer.link}</p>

                        {offer.location && (
                          <p className={styles.location}>{offer.location}</p>
                        )}

                        <div className={styles.tags}>
                          <span className={styles.tag}>
                            {"Kontakt: " +
                              offer.email +
                              ", " +
                              offer.phone_number}
                          </span>
                          <span className={styles.tag}>
                            {"NIP: " + offer.nip}
                          </span>
                        </div>
                      </div>

                      <div
                        className={styles.actions + " " + styles.detailsBtn}
                        onClick={() => open(offer.owner_id)}
                      >
                        Szczegóły
                      </div>
                    </div>
                  </>
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
