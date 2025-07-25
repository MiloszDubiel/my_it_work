import NavBar from "../NavBar/NavBar";
import styles from "./MainPage.module.css";
import JobOfferttsComponent from "../JobOffertsComponent/JobOffertsComponent";
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
          <JobOfferttsComponent amount={9} styles={styles} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
