import { useState, useRef } from "react";
import styles from "./CandiateInfo.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import ConfirmModal from "../PromptModals/ConfirmModal";
import { io } from "socket.io-client";

const CandidateInfo = ({ candidate }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmCallbackRef = useRef(null);

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
  const cv = parseList(candidate.cv);

  console.log(experiences);
  return (
    <div
      className={
        styles.container +
        " " +
        `candidate-details-container${candidate.user_id || candidate.id}`
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
              <div className={styles.company} style={{ fontSize: "14px" }}>
                Docelowe stanowisko:
                <span className={styles.companyName}>
                  {candidate.target_job || "Nie podano"}
                </span>
              </div>
              <div className={styles.company} style={{ fontSize: "13px" }}>
                Obecne stanowisko:
                <span className={styles.companyName}>
                  {candidate.present_job || "Nie podano"}
                </span>
              </div>

              <div className={styles.meta} style={{ fontSize: "12x" }}>
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
            <button
              className={styles.messageBtn}
              onClick={async () => {
                try {
                  const user = JSON.parse(sessionStorage.getItem("user-data"));

                  const res = await axios.post(
                    "http://localhost:5001/chat/create",
                    {
                      employer_id: user.id,
                      candidate_id: candidate.user_id,
                    }
                  );

                  const conversationId = res.data.id;

                  document.querySelector("#chatContainer").style.display =
                    "flex";

                  document.querySelector("#root").style.overflow = "hidden";
                  window.dispatchEvent(
                    new CustomEvent("openConversation", {
                      detail: { conversationId },
                    })
                  );
                } catch (err) {
                  console.error("Błąd uruchamiania wiadomości:", err);
                }
              }}
            >
              Wyślij wiadomość
            </button>

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
            <h3 className={styles.sectionTitle}>Opis</h3>
            <div>
              <p>{candidate.description}</p>
            </div>
            <hr />
            <h3 className={styles.sectionTitle}>CV</h3>
            {cv ? (
              <ul className={styles.refList}>
                {cv.map((el, i) =>
                  el.startsWith("http") ? (
                    <li key={i}>
                      <a
                        href={el}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.linkButtonSmall}
                      >
                        Otwórz CV
                      </a>
                    </li>
                  ) : (
                    <li key={i}>Brak CV</li>
                  )
                )}
              </ul>
            ) : (
              <p>Brak</p>
            )}

            <hr />
            <h3 className={styles.sectionTitle}>
              Doświadczenie w latch:{" "}
              {experiences.length > 0 ? (
                <span>{experiences[0]}</span>
              ) : (
                <span>Brak</span>
              )}
            </h3>

            <hr />
            <h3 className={styles.sectionTitle}>Wykształcenie</h3>
            {educations.length ? (
              <ul>
                {educations.map((el, i) => (
                  <li key={i}>
                    {el.name}, Poziom: {el.level}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak danych</p>
            )}
            <hr />
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
                          <strong>
                            {" "}
                            {s.name}, Poziom: {s.level}
                          </strong>
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
                          <strong>
                            {" "}
                            {l.name}, Poziom {l.level}
                          </strong>
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
