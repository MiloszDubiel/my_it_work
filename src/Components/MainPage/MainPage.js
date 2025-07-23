import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./MainPage.module.css";
import axios from "axios";

const MainPage = () => {
  return (
    <div className={styles.page}>
      <NavBar />
      <h1 className={styles.header}>Praca w IT</h1>
      <h2 className={styles.header} style={{ marginTop: 0 }}>
        Najnowsze oferty pracy
      </h2>
      <div className={styles.recommended}>
        <div className={styles.parent}>
          <div className={styles.div1}>Dupa</div>
          <div className={styles.div2}>2</div>
          <div className={styles.div3}>3</div>
          <div className={styles.div4}>4</div>
          <div className={styles.div5}>5</div>
          <div className={styles.div6}>6</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
