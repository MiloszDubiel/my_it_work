import CandidateInfo from "./CandidateInfo";
import styles from "./candidate.module.css";
import { useState } from "react";

const Candidate = ({ candidate, index }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
  

      <div className={styles.offerRow}>
        <div className={styles.logoSection}>
          <img
            src={candidate.avatar || "/default-company.png"}
            alt="Img"
            className={styles.companyImg}
          />
        </div>

        <div className={styles.infoSection}>
          <h3>{candidate.email}</h3>
          <p className={styles.company}>
            Preferowane stanowisko: {candidate.target_job || "Nie podano"}
          </p>

          <p className={styles.location} style={{ fontSize: "12px" }}>
            Lata doświadczenia: {candidate.years_of_experience || "Nie podano"}
          </p>

          <div className={styles.tags}>
            {/* SKILLS */}
            <span className={styles.item}>Umiejętności:</span>{" "}
            {skills.length === 0 ? (
              <span className={styles.item}>Brak danych</span>
            ) : (
              <>
                {skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className={styles.tag}>
                    {skill.name}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className={styles.item}>i więcej…</span>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={styles.actions}
          onClick={() => setIsOpen(true)}
        >
          <a className={styles.detailsBtn}>Szczegóły</a>
        </div>
      </div>
      {isOpen && <CandidateInfo candidate={candidate} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default Candidate;
