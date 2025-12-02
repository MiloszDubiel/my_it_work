import OfferInfo from "./OfferInfo";
import styles from "./offer.module.css";
import { useState } from "react";

const Offer = ({ offer, index }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Bezpieczne parsowanie JSON
  const parseJSON = (value) => {
    try {
      return JSON.parse(value) || [];
    } catch {
      return [];
    }
  };

  const technologies = parseJSON(offer.technologies);
  const firstTechnologies = technologies.slice(0, 2);

  // Czyszczenie workingMode
  const workingMode = String(offer.workingMode)
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll('"', "")
    .trim()
    .split(",")[0];

  return (
    <>
      <OfferInfo offer={offer} id={index} is_favorite={false} />

      <div className={styles.offerRow}>
        <div className={styles.logoSection}>
          <img
            src={offer.img || "/default-company.png"}
            alt={offer.companyName}
            className={styles.companyImg}
          />
        </div>
        <div className={styles.infoSection}>
          <h3>{offer.title}</h3>
          <p className={styles.company}>{offer.companyName}</p>

          {offer.location && (
            <p className={styles.location}>{offer.location}</p>
          )}

          <div className={styles.tags}>
            {/* TECHNOLOGIE */}
            <div className={styles.technologies}>
              <span className={styles.item}>Technologie:</span>{" "}
              {technologies.length === 0 ? (
                <span className={styles.item}>Nie podano</span>
              ) : (
                <>
                  {firstTechnologies.map((el, i) => (
                    <span key={i} className={styles.tag}>
                      {el}
                    </span>
                  ))}
                  {technologies.length > 2 && (
                    <span className={styles.item}>i więcej</span>
                  )}
                </>
              )}
            </div>

            {/* LOKALIZACJA */}
            <div className={styles.locations}>
              <span className={styles.item}>Lokalizacja:</span>{" "}
              <span className={styles.tag}>{workingMode}</span>
            </div>
          </div>
        </div>
        <div
          className={styles.actions}
          onClick={() => {
            document.querySelector(
              `.offer-details-container${offer.id}`
            ).style.display = "flex";

            document.querySelector("#root").style.overflow = "hidden";
          }}
        >
          <a className={styles.detailsBtn}>Szczegóły</a>
        </div>
      </div>
    </>
  );
};

export default Offer;
