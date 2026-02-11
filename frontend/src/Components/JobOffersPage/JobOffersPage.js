import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./JobOffersPage.module.css";
import SortButton, { Sort } from "../SortButton/SortButton";
import Navbar from "../NavBar/NavBar";
import Filter from "../Filter/Filter";
import Offer from "../Offert/Offer";
import LoadingComponent from "../Loading/LoadingComponent";

const JobOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");
  const offersPerPage = 9;

  const isEmptyObject = (obj) => {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get("http://localhost:5000/api/job-offerts", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        });

        if (!isEmptyObject(res.data)) {
          setIsLoading(false);
          setOffers(res.data);
        }
      } catch (err) {
        setIsLoading(false);
        setInfo("Brak ofert pracy ");
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
      <Filter offersPage={true} />
      <div className={styles.container}>
        <h1>Oferty pracy</h1>

        <div className={styles.offersList}>
          <SortButton offertPage={true} />
          {currentOffers.length > 0
            ? currentOffers.map((offer, index) => <Offer offer={offer} />)
            : isLoading && <LoadingComponent />}
          {info && <p className={styles.noOffers}>{info}</p>}
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
