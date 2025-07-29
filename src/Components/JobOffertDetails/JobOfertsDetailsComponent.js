import React from "react";
import styles from "./jobDetails.module.css";
import { IoCloseOutline } from "react-icons/io5";

const JobOfferttDetailsComponent = ({ styles1 }) => {
  return (
    <div className={styles.conteiner} id="showWindow">
      <div className={styles.details}>
        <div className={styles.closeWindow}>
          <p style={{ fontSize: "26px" }}>Szczegóły oferty</p>
          <IoCloseOutline
            onClick={() => {
              document
                .querySelector("#showWindow")
                .classList.remove(styles1.showWindow);
            }}
          />
        </div>
        {localStorage.getItem("currentOfert")}
      </div>
    </div>
  );
};

export default JobOfferttDetailsComponent;
