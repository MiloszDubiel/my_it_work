import styles from "./EmployerInfo.module.css";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState, useRef, use, useCallback } from "react";
import axios from "axios";
const EmployerInfo = ({ companyOwner, id }) => {
  const [company, setCompany] = useState(null);

  const fetchCompanyInfo = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/employers/get-company-info",
      {
        id: companyOwner,
      }
    );
    setCompany(res.data);
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, [companyOwner]);

  const parseList = (value) => {
    if (!value) return [];
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  const close = useCallback(() => {
    document.querySelector(`#company-info-${companyOwner}`).style.display =
      "none";
  });

  const technologies = parseList(company?.technologies);
  const locations = parseList(company?.locations);

  return (
    <div>
      <div className={styles.container} id={"company-info-" + companyOwner}>
        <main className={styles.wrapper}>
          <div className={styles.actionsBar}>
            <div className={styles.rightActions}>
              <button className={styles.closeBtn} onClick={close}>
                <IoMdClose />
              </button>
            </div>
          </div>

          <section className={styles.hero}>
            <div>
              {company?.img ? (
                <img
                  src={company?.img}
                  alt={company?.companyName}
                  className={styles.logo}
                />
              ) : (
                <div className={styles.logoPlaceholder}>
                  {company?.companyName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className={styles.headerLeft}>
              <h1 className={styles.title}>{company?.companyName}</h1>

              <div className={styles.sub}>
                <div className={styles.company} style={{ fontSize: "14px" }}>
                  Strona internetowa:
                  <span className={styles.companyName}>
                    {company?.link || "Nie podano"}
                  </span>
                </div>

                <div className={styles.company} style={{ fontSize: "13px" }}>
                  Email:
                  <span className={styles.companyName}>
                    {company?.email || "Nie podano"}
                  </span>
                </div>

                <div className={styles.meta} style={{ fontSize: "12px" }}>
                  NIP:
                  <span className={styles.salary}>
                    {company?.nip || "Nie podano"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.headerRight}>
              {company?.link && (
                <a
                  href={company.link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.applyBtn}
                >
                  Strona firmy
                </a>
              )}
              {company?.phone_number && (
                <span style={{ color: "#475569", fontSize: "14px" }}>
                  Tel: {company?.phone_number}
                </span>
              )}
              {company?.email && (
                <span style={{ color: "#475569", fontSize: "14px" }}>
                  Email: {company?.email}
                </span>
              )}
            </div>
          </section>

          <section className={styles.contentGrid}>
            <article className={styles.leftCol}>
              <h3 className={styles.sectionTitle}>Opis firmy</h3>
              {company?.company_description || company?.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{
                    __html:
                      company?.company_description || company?.description,
                  }}
                />
              ) : (
                <p>Brak opisu</p>
              )}
            </article>

            <aside className={styles.rightCol}>
              <h3 className={styles.sectionTitle}>Informacje dodatkowe</h3>

              <div className={styles.quickFacts}>
                <ul>
                  <li>
                    Technologie:
                    <ul>
                      {technologies.length ? (
                        technologies.map((t, i) => (
                          <li key={i}>
                            <strong>{t}</strong>
                          </li>
                        ))
                      ) : (
                        <li>Brak</li>
                      )}
                    </ul>
                  </li>

                  <li>
                    Lokalizacje:
                    <ul>
                      {locations.length ? (
                        locations.map((l, i) => (
                          <li key={i}>
                            <strong>{l}</strong>
                          </li>
                        ))
                      ) : (
                        <li>Brak</li>
                      )}
                    </ul>
                  </li>

                  <li>
                    Utworzono:
                    <strong>
                      {" "}
                      {new Date(company?.created_at).toLocaleDateString()}
                    </strong>
                  </li>

                  <li>
                    Ostatnia aktualizacja:
                    <strong>
                      {" "}
                      {new Date(company?.updated_at).toLocaleDateString()}
                    </strong>
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployerInfo;
