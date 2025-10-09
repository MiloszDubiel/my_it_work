import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import styles from "./ofertinfo.module.css";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

async function fetchDetails(link, type) {
  const response = await axios.post(
    "http://localhost:5000/api/job-offerts/scrape/details",
    {
      link,
      type,
    }
  );

  return response.data;
}

const OffertInfo = ({ offert, id }) => {
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    try {
      fetchDetails(offert.link, offert.type).then((res) => {
        setDetails(res.details);
        setIsLoading(false);
      });
    } catch (err) {
      setIsLoading(true);
      console.log(err);
    }
  }, []);

  return (
    <div
      id="offert-details-container"
      className={styles.container + " " + `offert-details-container${id}`}
    >
      <main className={styles.wrapper} aria-labelledby="job-title">
        <nav
          className={styles.actionsBar}
          role="navigation"
          aria-label="Akcje oferty"
        >
          <button className={styles.iconBtn}>Udostępnij</button>

          <div className={styles.rightActions}>
            <button style={{ all: "unset", cursor: "pointer" }}>
              <IoMdClose
                onClick={() => {
                  document.querySelector(
                    `.offert-details-container${id}`
                  ).style.display = "none";

                  document.querySelector("#root").style.overflow = "auto";
                }}
              />
            </button>
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.headerLeft}>
            <h1 id="job-title" className={styles.title}>
              {offert?.title}
            </h1>
            <div className={styles.sub}>
              <div className={styles.company}>
                <span className={styles.companyName}>
                  {offert?.companyName}
                </span>
              </div>

              <div className={styles.meta}>
                Zarobki:
                {offert?.salary === "not available" ? (
                  <span className={styles.salary}>Nie podano</span>
                ) : (
                  <span className={styles.salary}>{offert?.salary}</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.applyBtn}>
              <a href={offert.link} target="_blank" style={{ all: "unset" }}>
                Szczegóły aplikacji
              </a>
            </button>
          </div>{" "}
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.leftCol}>
            <h3 className={styles.sectionTitle}>Wymagane technologie</h3>
            <ul className={styles.techList}>
              {JSON.parse(offert.technologies).length != 0 ? (
                JSON.parse(offert.technologies).map((el) => <li>{el}</li>)
              ) : (
                <li>Brak podanych technologii</li>
              )}
            </ul>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: details.willDo }}
                ></div>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: details.offer }}
                ></div>
              </>
            )}
          </article>

          <aside
            className={styles.rightCol}
            aria-labelledby="company-info-title"
          >
            <h3 id="company-info-title" className={styles.sectionTitle}>
              O firmie
            </h3>
            <div className={styles.companyBox}>
              <div className={styles.companyRow}>
                <div className={styles.companyLogoSmall}>
                  <img src={offert?.img} alt="zdjecie" />
                </div>
                <div>
                  <div className={styles.companyNameSmall}>
                    {offert?.companyName}
                  </div>
                </div>
              </div>

              <div className={styles.compActions}>
                <button className={styles.compBtn}>Zobacz profil firmy</button>
                <button className={styles.compBtnOutline}>Kontakt</button>
              </div>
            </div>

            <div className={styles.quickFacts}>
              <h4 className={styles.sectionTitle}>Szybkie informacje</h4>
              <ul>
                <li>
                  Typ umowy:
                  <ul>
                    {JSON.parse(offert?.contractType || "[]").map((el) => {
                      return (
                        <li>
                          <strong>{el}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  Doświadczenie:{" "}
                  <ul>
                    {JSON.parse(offert?.experience || "[]").map((el) => {
                      return (
                        <li>
                          <strong>{el}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  Lokalizacja:{" "}
                  <ul>
                    {JSON.parse(offert?.workingMode || "[]")[1]?.length ===
                    0 ? (
                      <li>
                        <strong>
                          {JSON.parse(offert?.workingMode || "[]")[0]}
                        </strong>
                      </li>
                    ) : (
                      JSON.parse(offert?.workingMode || "[]")[1]?.map((el) => {
                        return (
                          <li>
                            <strong>{el}</strong>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default OffertInfo;
