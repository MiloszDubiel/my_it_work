import NavBar from "../NavBar/NavBar";
import { useEffect, useState, useRef } from "react";
import styles from "./ofertinfo.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { CiStar } from "react-icons/ci";
import ConfirmModal from "../PromptModals/ConfirmModal";
import InfoModal from "../PromptModals/InfoModal";

const OfferInfo = ({ offer, id, is_favorite }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData] = useState(JSON.parse(sessionStorage.getItem("user-data")));
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const confirmCallbackRef = useRef(null);

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
    checkApplication();
  }, [userData?.id, offer?.id]);

  useEffect(() => {
    window.addEventListener("deleted-application", checkApplication);
  });

  const checkApplication = async () => {
    if (!userData?.id || !offer?.id) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/job-offerts/applications/${userData.id}/${offer.id}`
      );
      setAlreadyApplied(res.data.applied);
      setAppliedDate(res.data.applied_at);
    } catch (err) {
      console.error("Błąd przy sprawdzaniu aplikacji:", err);
    }
  };

  const applyToOffer = async () => {
    if (!userData?.id) {
      setModalMessage("Musisz być zalogowany, aby aplikować");
      setShowInfo(true);
      return;
    }

    if (alreadyApplied) {
      setModalMessage(
        `Już aplikowałeś na tę ofertę: ${new Date(
          appliedDate
        ).toLocaleDateString()}`
      );
      setShowInfo(true);
      return;
    }

    // 🔥 teraz confirm modal zamiast window.confirm
    setModalMessage("Czy na pewno chcesz aplikować na tę ofertę?");
    setShowConfirm(true);

    confirmCallbackRef.current = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/job-offerts/applications",
          {
            user_id: userData.id,
            offer_id: offer.id,
          }
        );

        setModalMessage(res.data.message);
        setShowInfo(true);
        setAlreadyApplied(true);
        setAppliedDate(new Date());
        window.dispatchEvent(new Event("applied"));
      } catch (err) {
        setModalMessage("Błąd przy aplikowaniu");
        setShowInfo(true);
      }
    };
  };

  return (
    <div
      id="offer-details-container"
      className={
        styles.container +
        " " +
        (is_favorite
          ? `favorite${offer.id}`
          : `offer-details-container${offer.id}`)
      }
    >
      {showConfirm && (
        <ConfirmModal
          message={modalMessage}
          onConfirm={() => {
            if (confirmCallbackRef.current) {
              confirmCallbackRef.current();
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <main className={styles.wrapper} aria-labelledby="job-title">
        <div className={styles.actionsBar}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className={styles.iconBtn}>Udostępnij</button>

            {userData?.email && userData?.role === "candidate" && (
              <button onClick={toggleFavorite} className={styles.iconBtn}>
                {isFavorite ? (
                  <CiStar className={styles.starFilled} />
                ) : (
                  <CiStar className={styles.starEmpty} />
                )}
              </button>
            )}
          </div>

          <button
            className={styles.closeBtn}
            onClick={() => {
              if (is_favorite) {
                document.querySelector(`.favorite${offer.id}`).style.display =
                  "none";
                document.querySelector("#root").style.overflow = "auto";
                return;
              }
              document.querySelector(
                `.offer-details-container${offer.id}`
              ).style.display = "none";
              document.querySelector("#root").style.overflow = "auto";
            }}
          >
            <IoMdClose />
          </button>
        </div>

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
              ) : userData?.role != "employer" &&
                userData?.role != "admin" &&
                !!userData?.role ? (
                <>
                  <button className={styles.applyBtn} onClick={applyToOffer}>
                    {alreadyApplied ? "Już aplikowano" : "Aplikuj"}
                  </button>

                  {alreadyApplied && appliedDate && (
                    <p
                      style={{
                        marginTop: "5px",
                        color: "green",
                        fontSize: "12px",
                      }}
                    >
                      Aplikowano dnia:{" "}
                      {new Date(appliedDate).toLocaleDateString()}
                    </p>
                  )}
                </>
              ) : (
                <button className={styles.applyBtn}>
                  Zaloguj się, aby aplikować
                </button>
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
