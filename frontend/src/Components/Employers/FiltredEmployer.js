import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./employers.module.css";
import SortButton from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";
import Filter from "../Filter/Filter";
import { useLocation } from "react-router-dom";
import EmployerInfo from "./EmployerInfo";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const FilltredEmployers = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 9;

  const { state } = useLocation();

  const open = useCallback((id) => {
    if (id)
      document.querySelector(`#company-info-${id}`).style.display = "flex";
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/employers/filltred",
          { state },
        );
        setOffers(res.data);
      } catch (err) {
        console.error("Błąd pobierania pracodawców:", err);
      }
    };

    fetchOffers();
  }, [state]);

  const indexOfLast = currentPage * offersPerPage;
  const indexOfFirst = indexOfLast - offersPerPage;
  const currentOffers = offers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  console.log(currentOffers);

  return (
    <>
      <Navbar />
      <Filter employersPage />
      <div className={styles.container}>
        <h1>Pracodawcy</h1>

        <div className={styles.offersList}>
          <SortButton employersPage />

          {currentOffers.length > 0 ? (
            currentOffers.map((offer) => {
              return (
                <>
                  <EmployerInfo companyOwner={offer.owner_id} />
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
                      onClick={() => {
                        open(offer.owner_id);
                      }}
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

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ‹
            </button>

            <span style={{ fontSize: "12px" }}>
              Strona {currentPage} z {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

export default FilltredEmployers;
