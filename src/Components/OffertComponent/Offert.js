import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import styles from "./offert.module.css";

const Offert = ({ offert, index }) => {
  let cities = null;

  if (JSON.parse(offert.workingMode)[1].length > 0) {
    cities = (
      <>
        <button
          className={styles.buttonCity}
          onClick={() => {
            document
              .querySelector(`.${styles.cities}`)
              .classList.toggle(styles.showCities);
          }}
        >
          {JSON.parse(offert?.workingMode)[0] + " i więcej"}
        </button>
        <div className={styles.cities}>
          {JSON.parse(offert.workingMode)[1].map((el) => {
            return <span>{el}</span>;
          })}
        </div>
      </>
    );
  } else {
    cities = <span>{JSON.parse(offert.workingMode)}</span>;
  }

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
        <img src={offert.img} width={80} />
      </div>
      <div className={styles.info}>
        <div className={styles.info1}>
          <span
            style={{
              fontWeight: "bold",
              paddingTop: "10px",
              gap: "20px",
              display: "flex",
              position: "relative",
            }}
          >
            {offert.title}
            <button className={styles.apply}>Aplikuj</button>
          </span>
          <span style={{ fontSize: "12px", paddingTop: "2px" }}>
            {offert.companyName}
          </span>
        </div>
        <div className={styles.info2}>
          <div>
            <span>
              <CiLocationOn />
              {cities}
            </span>
            <span>
              <BsFileText />
              {offert.contractType}
            </span>
            <span>
              <MdGrading />
              {offert.experience}
            </span>
          </div>
          <div className={styles.box}>
            {JSON.parse(offert.technologies).map((el) => {
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
        <MdFavorite />
      </div>
    </div>
  );
};

export default Offert;
