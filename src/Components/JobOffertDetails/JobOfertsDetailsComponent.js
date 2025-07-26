import React from "react";
import styles from "./jobDetails.module.css";
import { IoCloseOutline } from "react-icons/io5";

const JobOfferttDetailsComponent = (props) => {
  return (
    <div className={styles.conteiner}>
      <div className={styles.details}>
        <div className={styles.closeWindow}>
          <p style={{ fontSize: "26px" }}>Szczegóły oferty</p>
          <IoCloseOutline />
        </div>
      </div>
    </div>
  );
};

export default JobOfferttDetailsComponent;
