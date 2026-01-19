import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CandidatePage.module.css";
import Navbar from "../NavBar/NavBar";
import Candidate from "./Candidate";
import LoadingComponent from "../Loading/LoadingComponent";
import Filter from "../Filter/Filter";

const CandidatePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");
  const candidatesPerPage = 9;

  const isEmptyObject = (obj) => {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get("http://localhost:5000/api/candidates");

        if (!isEmptyObject(res.data)) {
          setIsLoading(false);
          setCandidates(res.data);
        }
      } catch (err) {
        setIsLoading(false);
        setInfo("Brak ofert pracy ");
        console.error("Błąd podczas pobierania ofert:", err);
      }
    };
    fetchCandidates();
  }, []);

  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentcandidates = candidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <Navbar />
      <Filter candidatesPage={true} />
      <div className={styles.container}>
        <h1>Kandydaci</h1>

        <div className={styles.candidateList}>
          {currentcandidates.length > 0
            ? currentcandidates.map((candidate, index) => (
                <Candidate candidate={candidate} index={candidate.user_id} />
              ))
            : isLoading && <LoadingComponent />}
          {info && <p className={styles.nocandidates}>{info}</p>}
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

export default CandidatePage;
