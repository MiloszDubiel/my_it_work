import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./employers.module.css";
import SortButton, { Sort } from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";
import Filter from "../FilterComponent/Filter";
import { useLocation } from "react-router-dom";

const FilltredEmployers = ({}) => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 9;

  const location = useLocation();
  const { state } = location;

  console.log(state);

  useEffect(() => {
    const fetchOffers = async () => {
      console.log("DUPA");
      try {
        const res = await axios.post(
          `http://localhost:5000/api/employers/filltred`,
          {
            state,
          }
        );

        setOffers(res.data);
      } catch (err) {
        console.error("Błąd podczas pobierania ofert:", err);
      }
    };
    fetchOffers();
  }, [state]);
  useEffect(() => {
    window.addEventListener("changed-sort-option", () => {
      const copyOfOferts = [...offers];
      console.log(copyOfOferts);

      const type = sessionStorage.getItem("sort-option");
      setOffers(Sort(copyOfOferts, type));
      setCurrentPage(1);
    });
  });

  // Paginacja
  const indexOfLast = currentPage * offersPerPage;
  const indexOfFirst = indexOfLast - offersPerPage;
  const currentOffers = offers?.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(offers?.length / offersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <Navbar />
      <Filter employersPage={true} />
      <div className={styles.container}>
        <h1>Pracodawcy</h1>

        <div className={styles.offersList}>
          <SortButton employersPage={true} />
          {currentOffers?.length > 0 ? (
            currentOffers.map((offer, index) => (
              <div className={styles.offerRow} key={index}>
                <div className={styles.logoSection}>
                  <img
                    src={offer.img || "/default-company.png"}
                    alt={offer.companyName}
                    className={styles.companyImg}
                  />
                </div>

                <div className={styles.infoSection}>
                  <h3>{offer.title}</h3>
                  <p className={styles.company}>{offer.companyName}</p>

                  {offer.location && (
                    <p className={styles.location}>{offer.location}</p>
                  )}

                  <div className={styles.tags}>
                    <div className={styles.technologies}>
                      {offer.technologies &&
                        JSON.parse(offer.technologies)[0]
                          .slice(0, 2)
                          .map((tech, i) => (
                            <span key={i} className={styles.tag}>
                              {tech}
                            </span>
                          ))}

                      {JSON.parse(offer.technologies)[0].slice(0, 2).length <
                      JSON.parse(offer.technologies)[0].length ? (
                        <p className={styles.item}>i więcej... </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className={styles.locations}>
                      <p className={styles.item}>Lokalizacje: </p>{" "}
                      {offer.locations ? (
                        <span className={styles.tag}>
                          {JSON.parse(offer.locations)[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <a
                    href={offer.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.detailsBtn}
                  >
                    Szczegóły
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noOffers}>Brak dostępnych ofert.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ‹
            </button>
            <span style={{ fontSize: "12px" }}>
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

export default FilltredEmployers;
