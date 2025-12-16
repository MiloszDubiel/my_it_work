import styles from "./EmployerInfo.module.css";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import OfferInfo from "../Offert/OfferInfo";

const EmployerInfo = ({ companyOwner = 0, id }) => {
  const [company, setCompany] = useState(null);
  const [offers, setOffers] = useState([]);

  const fetchCompanyInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/employers/get-company-info",
        { id: companyOwner }
      );

      if (res.data?.companyInfo?.length > 0) {
        setCompany(res.data.companyInfo[0]);
      } else {
        setCompany(null);
        console.warn("Brak danych firmy dla id:", companyOwner);
      }
    } catch (err) {
      console.error("Błąd pobierania danych firmy:", err);
      setCompany(null);
    }
  };
  const fetchCompanyOffers = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/employers/get-my-offers",
        { owner_id: companyOwner }
      );

      setOffers(res.data?.offers || []);
    } catch (err) {
      console.error("Błąd pobierania ofert firmy:", err);
      setOffers([]);
    }
  };

  useEffect(() => {
    if (!companyOwner) return;
    fetchCompanyInfo();
    fetchCompanyOffers();
  }, [companyOwner]);

  const parseList = (value) => {
    if (!value) return [];
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  const safeParseArray = (value) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const close = useCallback(() => {
    document.querySelector(`#company-info-${companyOwner}`).style.display =
      "none";
  });

  const openWindow = useCallback((id) => {
    console.log(id);

    document.querySelector(`.offer-details-container${id}`).style.display =
      "flex";

    document.querySelector("#root").style.overflow = "hidden";
  });

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
              <h3 className={styles.sectionTitle}>Oferty pracy</h3>

              <div className={styles.offersGrid}>
                {offers.length ? (
                  offers.map((offer, index) => {
                    const id = offer.id;

                    return (
                      <>
                        <OfferInfo
                          offer={offer}
                          id={index}
                          is_favorite={false}
                          in_company_info={true}
                        />
                        <div key={offer.id} className={styles.offerCard}>
                          <h4 className={styles.offerTitle}>{offer.title}</h4>

                          {offer.salary && (
                            <p className={styles.offerSalary}>
                              💰 {offer.salary} PLN
                            </p>
                          )}

                          <p className={styles.offerMeta}>
                            {safeParseArray(offer.contractType).join(", ")}
                          </p>

                          <p className={styles.offerMeta}>
                            {safeParseArray(offer.workingMode).join(", ")}
                          </p>

                          <div className={styles.offerTech}>
                            {safeParseArray(offer.technologies)
                              .slice(0, 3)
                              .map((tech, i) => (
                                <span key={i} className={styles.techTag}>
                                  {tech}
                                </span>
                              ))}
                          </div>

                          {offer.sctive_to && (
                            <p className={styles.offerDate}>
                              Wazne do: {offer.active_to}
                            </p>
                          )}

                          <a
                            className={styles.offerBtn}
                            onClick={() => openWindow(id)}
                          >
                            Przejdź do oferty
                          </a>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <p style={{ fontSize: 13, color: "#6b7280" }}>
                    Brak aktywnych ofert pracy
                  </p>
                )}
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployerInfo;
