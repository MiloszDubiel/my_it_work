import React from "react";
import Navbar from "../NavBar/NavBar";
import styles from "./MainPage.module.css";

const MainPage = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.parent}>
          <div className={styles.div1}>
            <h1>Znajdź z nami szybko pracę w branży IT</h1>
          </div>
          <div className={styles.div2}>
            <div className={styles.searchBox}>
              <form>
                <div className={styles.form1}>
                  <input
                    type="text"
                    className={styles.search}
                    placeholder="Technologia/specjalizacja"
                  />
                  <select className={styles.location}>
                    <option value="" selected disabled hidden>
                      Lokalizacja
                    </option>
                  </select>
                  <select className={styles.type}>
                    <option value="" selected disabled hidden>
                      Typ umowy
                    </option>
                  </select>
                  <select className={styles.experience}>
                    <option value="" selected disabled hidden>
                      Poziom doświadczenia
                    </option>
                    <option value="B2B">kontrakt B2B</option>
                    <option value="contract">umowa o pracę</option>
                  </select>
                </div>
                <div className={styles.form2}>
                  <button className={styles.clear}>Wyczyść</button>
                  <button className={styles.searchButton}>Szukaj ofert</button>
                </div>
              </form>
            </div>
          </div>
          <div className={styles.div3}>3</div>
        </div>
      </main>
    </>
  );
};

export default MainPage;
