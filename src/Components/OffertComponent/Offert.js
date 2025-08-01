import { CiLocationOn } from "react-icons/ci";
import { BsFileText } from "react-icons/bs";
import { MdGrading } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import styles from "./offert.module.css";

const Offert = ({ offert, index }) => {
  return (
    <div
      className={styles.offerts}
      key={index}
      onClick={() => {
        document.querySelector("#showOfert").classList.add("showOfert");
        localStorage.setItem("currentOfert", JSON.stringify(offert));
        window.dispatchEvent(new Event("ofert-selected"));
      }}
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
          <span style={{ fontWeight: "bold", paddingTop: "10px" }}>
            {offert.title}
          </span>
          <span style={{ fontSize: "12px", paddingTop: "2px" }}>
            {offert.companyName}
          </span>
        </div>
        <div className={styles.info2}>
          <div>
            <span>
              {" "}
              <CiLocationOn />
              {offert.workingMode}
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
            {offert.technologies.map((el) => {
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
