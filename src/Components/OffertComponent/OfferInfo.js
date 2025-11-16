import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import styles from "./ofertinfo.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { CiStar } from "react-icons/ci";

const OfferInfo = ({ offer, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/job-offerts/favorites/${userData.id}/${offer.id}`
        );
        setIsFavorite(res.data.isFavorite);
      } catch (err) {
        console.error("Błąd przy sprawdzaniu ulubionych:", err);
      } finally {
        setLoading(false);
      }
    };

    if (offer?.id && userData?.id) checkFavorite();
  }, [offer?.id, userData?.id]);
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(
          `http://localhost:5000/api/job-offerts/favorites/${userData.id}/${offer.id}`
        );
        setIsFavorite(false);
        sessionStorage.setItem("setIsFavorite", false);
        window.dispatchEvent(new Event("setIsFavorite"));
      } else {
        await axios.post("http://localhost:5000/api/job-offerts/favorites", {
          user_id: userData.id,
          offer_id: offer.id,
        });
        setIsFavorite(true);
        sessionStorage.setItem("setIsFavorite", true);
        window.dispatchEvent(new Event("setIsFavorite"));
      }
    } catch (err) {
      console.error("Błąd przy aktualizacji ulubionych:", err);
    }
  };

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [appliedDate, setAppliedDate] = useState(null);

  useEffect(() => {
    const checkApplication = async () => {
      if (!userData?.id || !offer?.id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/applications/${userData.id}/${offer.id}`
        );
        setAlreadyApplied(res.data.applied);
        setAppliedDate(res.data.applied_at);
      } catch (err) {
        console.error("Błąd przy sprawdzaniu aplikacji:", err);
      }
    };
    checkApplication();
  }, [userData?.id, offer?.id]);

  const applyToOffer = async () => {
    if (!userData?.id) return alert("Musisz być zalogowany, aby aplikować");

    if (alreadyApplied) {
      return alert(
        `Już aplikowałeś na tę ofertę w dniu: ${new Date(
          appliedDate
        ).toLocaleDateString()}`
      );
    }

    const confirmApply = window.confirm(
      "Czy na pewno chcesz aplikować na tę ofertę?"
    );
    if (!confirmApply) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/job-offerts/applications",
        {
          user_id: userData.id,
          offer_id: offer.id,
        }
      );
      alert(res.data.message);
      setAlreadyApplied(true);
      setAppliedDate(new Date());
    } catch (err) {
      console.error(err);
      alert("Błąd przy aplikowaniu");
    }
  };

  return (
    <div
      id="offer-details-container"
      className={styles.container + " " + `offer-details-container${offer.id}`}
    >
      <main className={styles.wrapper} aria-labelledby="job-title">
        <nav
          className={styles.actionsBar}
          role="navigation"
          aria-label="Akcje oferty"
        >
          <div style={{ display: "flex", gap: " 10px" }}>
            <button className={styles.iconBtn}>Udostępnij</button>

            {userData?.email && userData?.role === "candidate" ? (
              <button onClick={toggleFavorite} className={styles.iconBtn}>
                {isFavorite ? (
                  <CiStar className={styles.starFilled} />
                ) : (
                  <CiStar className={styles.starEmpty} />
                )}
              </button>
            ) : (
              ""
            )}
          </div>

          <div className={styles.rightActions}>
            <button style={{ all: "unset", cursor: "pointer" }}>
              <IoMdClose
                onClick={() => {
                  document.querySelector(
                    `.offer-details-container${offer.id}`
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
            <a href={offer.link} target="_blank" style={{ all: "unset" }}>
              {offer.source == "scraped" ? (
                <button className={styles.applyBtn}>
                  Przejdz do strony z ofertą{" "}
                </button>
              ) : (
                <>
                  <button className={styles.applyBtn} onClick={applyToOffer}>
                    {alreadyApplied ? "Już aplikowano" : "Aplikuj"}
                  </button>

                  {alreadyApplied && appliedDate && (
                    <p style={{ marginTop: "5px", color: "green" }}>
                      Aplikowano dnia:{" "}
                      {new Date(appliedDate).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </a>
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
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                ></div>
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: offer.description }}
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
                    {String(offer.workingMode)
                      .replaceAll("[", "")
                      .replaceAll("]", "")
                      .replaceAll('"', "")
                      .trim()
                      .split(",")
                      .map((el) => {
                        return <li>{el}</li>;
                      })}
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
