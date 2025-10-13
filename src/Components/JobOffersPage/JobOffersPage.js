import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./JobOffersPage.module.css";
import SortButton, { Sort } from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";

const JobOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 9;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job-offerts");
        setOffers(res.data);
      } catch (err) {
        console.error("Błąd podczas pobierania ofert:", err);
      }
    };
    fetchOffers();
  }, []);
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
  const currentOffers = offers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Oferty pracy</h1>

        <div className={styles.offersList}>
          <SortButton offertPage={true} />
          {currentOffers.length > 0 ? (
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
                      <span className={styles.item}>Technologie:</span>{" "}
                      {JSON.parse(offer.technologies).length > 0 &&
                        JSON.parse(offer.technologies)
                          .slice(0, 2)
                          .map((el) => {
                            return <span className={styles.tag}>{el}</span>;
                          })}
                      {JSON.parse(offer.technologies).slice(0, 2).length <
                      JSON.parse(offer.technologies).length ? (
                        <span className={styles.item}>i więcej</span>
                      ) : (
                        ""
                      )}
                      {JSON.parse(offer.technologies).length === 0 && (
                        <span className={styles.item}>Nie podano</span>
                      )}
                    </div>

                    <div className={styles.locations}>
                      <span className={styles.item}>Lokalizacja:</span>{" "}
                      {JSON.parse(offer.workingMode)?.length > 0 && (
                        <span className={styles.tag}>
                          {JSON.parse(offer.workingMode)[0]}
                        </span>
                      )}
                      {JSON.parse(offer.workingMode)[1]?.length > 1 && (
                        <span className={styles.item}>i więcej</span>
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

export default JobOffersPage;
