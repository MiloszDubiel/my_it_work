import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import styles from "./ofertinfo.module.css";
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

const OfferInfo = ({ offer, id }) => {
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    try {
      fetchDetails(offer.link, offer.type).then((res) => {
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
      id="offer-details-container"
      className={styles.container + " " + `offer-details-container${id}`}
    >
      <main className={styles.wrapper} aria-labelledby="job-title">
        <nav
          className={styles.actionsBar}
          role="navigation"
          aria-label="Akcje oferty"
        >
          <div style={{ display: "flex", gap: " 10px" }}>
            <button className={styles.iconBtn}>Udostępnij</button>
            <button className={styles.iconBtn}>Dodaj do ulubionych</button>
          </div>

          <div className={styles.rightActions}>
            <button style={{ all: "unset", cursor: "pointer" }}>
              <IoMdClose
                onClick={() => {
                  document.querySelector(
                    `.offer-details-container${id}`
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
              {offer?.title}
            </h1>
            <div className={styles.sub}>
              <div className={styles.company}>
                <span className={styles.companyName}>{offer?.companyName}</span>
              </div>

              <div className={styles.meta}>
                Zarobki:
                {offer?.salary === "not available" ? (
                  <span className={styles.salary}>Nie podano</span>
                ) : (
                  <span className={styles.salary}>{offer?.salary}</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.applyBtn}>
              <a href={offer.link} target="_blank" style={{ all: "unset" }}>
                Szczegóły aplikacji
              </a>
            </button>
          </div>{" "}
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.leftCol}>
            <h3 className={styles.sectionTitle}>Wymagane technologie</h3>
            <ul className={styles.techList}>
              {JSON.parse(offer.technologies).length > 0 ? (
                JSON.parse(offer.technologies).map((el) => <li>{el}</li>)
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
                  <img src={offer?.img} alt="zdjecie" />
                </div>
                <div>
                  <div className={styles.companyNameSmall}>
                    {offer?.companyName}
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
                    {JSON.parse(offer?.contractType || "[]").map((el) => {
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
                    {JSON.parse(offer?.experience || "[]").map((el) => {
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
                    {JSON.parse(offer?.workingMode || "[]")[1]?.length === 0 ? (
                      <li>
                        <strong>
                          {JSON.parse(offer?.workingMode || "[]")[0]}
                        </strong>
                      </li>
                    ) : (
                      JSON.parse(offer?.workingMode || "[]")[1]?.map((el) => {
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

export default OfferInfo;
