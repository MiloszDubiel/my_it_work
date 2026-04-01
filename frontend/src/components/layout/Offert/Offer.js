import React, { useState } from "react";
import OfferInfo from "./OfferInfo";
import styles from "./offer.module.css";

const Offer = ({ offer, index }) => {
  const parseJSON = (value) => {
    try {
      return JSON.parse(value) || [];
    } catch {
      return [];
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const technologies = parseJSON(offer.technologies);
  const firstTechnologies = technologies.slice(0, 2);

  const workingMode = String(offer.workingMode)
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll('"', "")
    .trim()
    .split(",")[0];

  return (
    <>
      <div className={styles.offerRow}>
        <div className={styles.logoSection}>
          <img
            src={
              offer.company_img ||
              offer.offer_img ||
              "http://localhost:5000/uploads/offert_logo/default.jpg"
            }
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

            <div className={styles.locations}>
              <span className={styles.item}>Lokalizacja:</span>{" "}
              <span className={styles.tag}>{workingMode}</span>
            </div>
          </div>
        </div>
       <div
  className={styles.actions}
  onClick={() => setIsOpen(true)}
>
  <a className={styles.detailsBtn}>Szczegóły</a>
</div>
      </div>
          {isOpen && (
  <OfferInfo
    offer={offer}
    id={index}
    is_favorite={false}
    onClose={() => setIsOpen(false)}
  />
)}
    </>
  );
};

export default Offer;
