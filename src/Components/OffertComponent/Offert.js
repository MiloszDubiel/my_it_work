import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import OffertInfo from "./OffertInfo";
import styles from "./offert.module.css";

const Offert = ({ offert, index }) => {
  return (
    <>
      <OffertInfo offert={offert} id={index} />
      <div
        className={styles.offerts}
        key={index}
        onClick={() => {
          document.querySelector(
            `.offert-details-container${index}`
          ).style.display = "flex";

          document.querySelector("#root").style.overflow = "hidden";
        }}
        onLoad={() => {
          let el = document.querySelector(".pagination");

          if (el) {
            el.style.display = "flex";
          }
        }}
      >
        <div className={styles.companyImg}>
          <img src={offert.img} width={80} alt="" />
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
            </span>
            <span style={{ fontSize: "12px", paddingTop: "2px" }}>
              {offert.companyName}
            </span>
          </div>
          <div className={styles.info2}>
            <div>
              <span>
                <CiLocationOn />
                {JSON.parse(offert?.workingMode)[0]}
                {JSON.parse(offert?.workingMode)[1]?.length > 0
                  ? " i więcej"
                  : ""}
              </span>
              <span>
                <BsFileText />
                {JSON.parse(offert.contractType).map((el) => {
                  return <span>{el}</span>;
                })}
              </span>
              <span>
                <MdGrading />
                {JSON.parse(offert.experience).map((el) => {
                  return <span>{el}</span>;
                })}
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
    </>
  );
};

export default Offert;
