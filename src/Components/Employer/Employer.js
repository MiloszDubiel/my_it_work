import styles from "./employer.module.css";
import { CiLocationOn } from "react-icons/ci";
const Employer = ({ offert, index }) => {
  return (
    <div
      className={styles.offerts}
      key={index}
      onLoad={() => {
        let el = document.querySelector(".pagination");

        if (el) {
          el.style.display = "flex";
        }
      }}
    >
      <div className={styles.companyImg}>
        <img width={80} src={offert.img} />
      </div>
      <div className={styles.info}>
        <div className={styles.info1}>
          <span
            style={{
              fontWeight: "bold",
              paddingTop: "10px",
              gap: "20px",
              display: "flex",
            }}
          >
            {offert.companyName}
          </span>
          <span style={{ fontSize: "12px", paddingTop: "2px" }}></span>
        </div>
        <div className={styles.info2}>
          <div>
            <span>
              <CiLocationOn />
              <button
                onClick={(e) => {
                  if (JSON.parse(offert.locations)[1][0].length !== 0) {
                    e.target.parentElement.parentElement
                      .querySelector(`.${styles.cities}`)
                      .classList.toggle(styles.showCities);
                  }
                }}
                style={{ all: "unset" }}
              >
                {JSON.parse(offert.locations)[0]}
              </button>
              <div className={styles.cities}>
                {JSON.parse(offert.locations)[1][0].length !== 0
                  ? JSON.parse(offert.locations)[1][0].map((tag) => {
                      return <span>{tag}</span>;
                    })
                  : ""}
              </div>
            </span>
          </div>
          <div className={styles.box}>
            {JSON.parse(offert.technologies)[0].map((el) => {
              return (
                <>
                  <span className={styles.ellipsis} data-text={el}>
                    {el}
                  </span>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.addToFavorite}>
        <button className={styles.apply}>Pokaż oferty pracy</button>
      </div>
    </div>
  );
};
export default Employer;
