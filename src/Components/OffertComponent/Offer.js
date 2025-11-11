import OfferInfo from "./OfferInfo";
import styles from "./offer.module.css";

const Offer = ({ offer, index }) => {
  return (
    <>
      <OfferInfo offer={offer} id={index} />
      <div className={styles.offerRow} key={index}>
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
            <div className={styles.technologies}>
              <span className={styles.item}>Technologie:</span>{" "}
              {JSON.parse(offer.technologies).length > 0 &&
                JSON.parse(offer.technologies)
                  .slice(0, 2)
                  .map((el) => {
                    return <span className={styles.tag}>{el}</span>;
                  })}
              {JSON.parse(offer.technologies).slice(0, 2).length <
              JSON.parse(offer.technologies).length ? (
                <span className={styles.item}>i więcej</span>
              ) : (
                ""
              )}
              {JSON.parse(offer.technologies).length === 0 && (
                <span className={styles.item}>Nie podano</span>
              )}
            </div>

            <div className={styles.locations}>
              <span className={styles.item}>Lokalizacja:</span>{" "}
              {JSON.parse(offer.workingMode)?.length > 0 && (
                <span className={styles.tag}>
                  {JSON.parse(offer.workingMode)[0]}
                </span>
              )}
              {JSON.parse(offer.workingMode)[1]?.length > 1 && (
                <span className={styles.item}>i więcej</span>
              )}
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
