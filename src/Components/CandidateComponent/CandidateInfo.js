import { useState, useRef } from "react";
import styles from "./CandiateInfo.module.css";
import { IoMdClose } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import ConfirmModal from "../PromptModals/ConfirmModal";

const CandidateInfo = ({ candidate }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const confirmCallbackRef = useRef(null);

  console.log(candidate.skills);
  const parseList = (value) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };
  const skills = parseList(candidate.skills);
  const languages = parseList(candidate.lang);
  const locations = parseList(candidate.locations);
  const workingMode = parseList(candidate.working_mode);
  const experiences = parseList(candidate.exp);
  const educations = parseList(candidate.edu);
  const references = parseList(candidate.references);

  return (
    <div
      className={
        styles.container + " " + `candidate-details-container${candidate.id}`
      }
    >
      {showConfirm && (
        <ConfirmModal
          message="Czy na pewno chcesz wykonać tę akcję?"
          onConfirm={() => {
            if (confirmCallbackRef.current) confirmCallbackRef.current();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <main className={styles.wrapper}>
        {/* ACTION BAR */}
        <div className={styles.actionsBar}>
          <div className={styles.rightActions}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                document.querySelector(
                  `.candidate-details-container${candidate.user_id}`
                ).style.display = "none";
                document.querySelector("#root").style.overflow = "auto";
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className={styles.hero}>
          <div>
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className={styles.logo}
              />
            ) : (
              <div className={styles.logoPlaceholder}>
                {candidate.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              {candidate.name + " " + candidate.surname}
            </h1>

            <div className={styles.sub}>
              <div className={styles.company}>
                Docelowe stanowisko:
                <span className={styles.companyName}>
                  {candidate.target_job || "Nie podano"}
                </span>
              </div>
              <div className={styles.company}>
                Obecne stanowisko:
                <span className={styles.companyName}>
                  {candidate.present_job || "Nie podano"}
                </span>
              </div>

              <div className={styles.meta}>
                Lata doświadczenie:
                <span className={styles.salary}>
                  {candidate.career_level || "Nie podano"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            {candidate.link_git && (
              <a
                href={candidate.link_git}
                target="_blank"
                rel="noreferrer"
                className={styles.applyBtn}
              >
                GitHub
              </a>
            )}

            {candidate.phone_number && (
              <span style={{ color: "#475569", fontSize: "14px" }}>
                Tel: {candidate.phone_number}
              </span>
            )}
          </div>
        </section>

        {/* CONTENT GRID */}
        <section className={styles.contentGrid}>
          {/* LEFT COL */}
          <article className={styles.leftCol}>
            <h3 className={styles.sectionTitle}>CV</h3>
            {candidate.cv ? (
              <a
                href={candidate.cv}
                target="_blank"
                rel="noreferrer"
                className={styles.linkButton}
              >
                Otwórz CV
              </a>
            ) : (
              <p>Brak</p>
            )}

            <h3 className={styles.sectionTitle}>Doświadczenie</h3>
            {experiences.length ? (
              <ul>
                {experiences.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            ) : (
              <p>Brak danych</p>
            )}

            <h3 className={styles.sectionTitle}>Wykształcenie</h3>
            {educations.length ? (
              <ul>
                {educations.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
            ) : (
              <p>Brak danych</p>
            )}

            <h3 className={styles.sectionTitle}>Referencje</h3>
            {references.length ? (
              <ul className={styles.refList}>
                {references.map((el, i) =>
                  el.startsWith("http") ? (
                    <li key={i}>
                      <a
                        href={el}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.linkButtonSmall}
                      >
                        Zobacz referencję {i + 1}
                      </a>
                    </li>
                  ) : (
                    <li key={i}>{el}</li>
                  )
                )}
              </ul>
            ) : (
              <p>Brak</p>
            )}
          </article>

          {/* RIGHT COL */}
          <aside className={styles.rightCol}>
            <h3 className={styles.sectionTitle}>Informacje dodatkowe</h3>

            <div className={styles.quickFacts}>
              <ul>
                <li>
                  Umiejętności:
                  <ul>
                    {skills.length ? (
                      skills.map((s, i) => (
                        <li key={i}>
                          <strong> {s}</strong>
                        </li>
                      ))
                    ) : (
                      <li>Brak</li>
                    )}
                  </ul>
                </li>

                <li>
                  Języki:
                  <ul>
                    {languages.length ? (
                      languages.map((l, i) => (
                        <li key={i}>
                          <strong> {l}</strong>
                        </li>
                      ))
                    ) : (
                      <li>Brak</li>
                    )}
                  </ul>
                </li>

                <li>
                  Preferowane lokalizacje:
                  <ul>
                    {locations.length ? (
                      locations.map((l, i) => (
                        <li key={i}>
                          <strong> {l}</strong>
                        </li>
                      ))
                    ) : (
                      <li>Brak</li>
                    )}
                  </ul>
                </li>

                <li>
                  Tryb pracy:
                  <ul>
                    {workingMode.length ? (
                      workingMode.map((m, i) => (
                        <li key={i}>
                          <strong> {m}</strong>
                        </li>
                      ))
                    ) : (
                      <li>Brak</li>
                    )}
                  </ul>
                </li>

                <li>
                  Dostępność:
                  <strong> {candidate.access || "Nie podano"}</strong>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default CandidateInfo;
