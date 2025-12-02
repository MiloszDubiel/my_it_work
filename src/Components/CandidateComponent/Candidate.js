import CandidateInfo from "./CandidateInfo";
import styles from "./candidate.module.css";
import { useState } from "react";

const Candidate = ({ candidate, index }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const parseList = (value) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const skills = parseList(candidate.skills);
  const languages = parseList(candidate.lang);
  const locations = parseList(candidate.locations);
  const workingMode = parseList(candidate.working_mode);

  return (
    <>
      <CandidateInfo candidate={candidate} />

      <div className={styles.offerRow}>
        <div className={styles.logoSection}>
          <img
            src={"/default-company.png"}
            alt="User CV"
            className={styles.companyImg}
          />
        </div>

        <div className={styles.infoSection}>
          <h3>{candidate.present_job || "Brak nazwy stanowiska"}</h3>
          <p className={styles.company}>
            Cel zawodowy: {candidate.target_job || "Nie podano"}
          </p>

          <p className={styles.location}>
            Poziom kariery: {candidate.career_level || "Nie podano"}
          </p>

          <div className={styles.tags}>
            {/* SKILLS */}
            <div className={styles.technologies}>
              <span className={styles.item}>Umiejętności:</span>{" "}
              {skills.length === 0 ? (
                <span className={styles.item}>Brak danych</span>
              ) : (
                <>
                  {skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className={styles.tag}>
                      {skill}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className={styles.item}>i więcej…</span>
                  )}
                </>
              )}
            </div>

            {/* LANGUAGES */}
            <div className={styles.technologies}>
              <span className={styles.item}>Języki:</span>{" "}
              {languages.length === 0 ? (
                <span className={styles.item}>Brak</span>
              ) : (
                languages.map((lang, i) => (
                  <span key={i} className={styles.tag}>
                    {lang}
                  </span>
                ))
              )}
            </div>

            {/* LOCATIONS */}
            <div className={styles.locations}>
              <span className={styles.item}>Preferowane lokalizacje:</span>{" "}
              {locations.length === 0 ? (
                <span className={styles.item}>Brak danych</span>
              ) : (
                locations.map((loc, i) => (
                  <span key={i} className={styles.tag}>
                    {loc}
                  </span>
                ))
              )}
            </div>

            {/* WORKING MODE */}
            <div className={styles.locations}>
              <span className={styles.item}>Tryb pracy:</span>{" "}
              {workingMode.length === 0 ? (
                <span className={styles.item}>Nie podano</span>
              ) : (
                workingMode.map((mode, i) => (
                  <span key={i} className={styles.tag}>
                    {mode}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div
          className={styles.actions}
          onClick={() => {
            document.querySelector(
              `.candidate-details-container${candidate.user_id}`
            ).style.display = "flex";
          }}
        >
          <a className={styles.detailsBtn}>Szczegóły</a>
        </div>
      </div>
    </>
  );
};

export default Candidate;
