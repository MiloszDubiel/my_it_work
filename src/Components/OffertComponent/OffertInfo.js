import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import styles from "./ofertinfo.module.css";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

/**
 * Props:
 * - offer (optional) : object with all fields (if już masz dane)
 * - fetchUrl (optional) : endpoint do pobrania oferty po id, np '/api/offers'
 * - offerId (optional) : jeśli podajesz fetchUrl, podaj też offerId
 *
 * Example offer shape:
 * {
 *   id, title, companyName, companyId, location, contractType,
 *   experience, technologies: [], salary, img, description, linkToApply
 * }
 */

const OffertInfo = ({ offert, id }) => {
  console.log(offert);

  return (
    <>
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
                  document.querySelector(`#offertDetails${id}`).style.display =
                    "none";
                }}
              />
            </button>
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.headerLeft}>
            <h1 id="job-title" className={styles.title}>
              {offert.title}
            </h1>
            <div className={styles.sub}>
              <div className={styles.company}>
                <span className={styles.companyName}>{offert.companyName}</span>
              </div>

              <div className={styles.meta}>
                Zarobki:
                {offert.salary === "not available" ? (
                  <span className={styles.salary}>Nie podano</span>
                ) : (
                  <span className={styles.salary}>{offert.salary}</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.applyBtn}>Aplikuj teraz</button>
            <a className={styles.applyAlt}>Szczegóły aplikacji</a>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>Opis stanowiska</h2>
            <div className={styles.description} />

            <h3 className={styles.sectionTitle}>Wymagane technologie</h3>
            <ul className={styles.techList}>
              <li>lista technologi</li>
            </ul>
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
                  <img src={offert.img} alt="zdjecie" />
                </div>
                <div>
                  <div className={styles.companyNameSmall}>
                    {offert.companyName}
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
                    {JSON.parse(offert.contractType).map((el) => {
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
                    {JSON.parse(offert.experience).map((el) => {
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
                    {JSON.parse(offert.workingMode)[1]?.length === 0 ? (
                      <li>
                        <strong>{JSON.parse(offert.workingMode)[0]}</strong>
                      </li>
                    ) : (
                      JSON.parse(offert.workingMode)[1]?.map((el) => {
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
    </>
  );
};

export default OffertInfo;
