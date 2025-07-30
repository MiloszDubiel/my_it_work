import NavBar from "../NavBar/NavBar";
import styles from "./MainPage.module.css";
import JobOfferttsComponent from "../JobOfferts/JobOffertsComponent";
import JobOfferttDetailsComponent from "../JobOffertDetails/JobOfertsDetailsComponent";
import jobOfertsStyle from "../JobOffertDetails/jobDetails.module.css";
import Navbar from "../NavBar/NavBar";

const MainPage = () => {
  return (
    <>
      <JobOfferttDetailsComponent />
      <div className={styles.page}>
        <Navbar />
        <h1 className={styles.header}>Praca w IT</h1>
        <h2 className={styles.header} style={{ marginTop: 0 }}>
          Najnowsze oferty pracy
        </h2>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <JobOfferttsComponent
              amount={9}
              styles={styles}
              ofertDetailsStyle={jobOfertsStyle}
            />
          </div>
        </div>
        <div className={styles.showMoreOfferts}>
          <button>Pokaż więcej</button>
        </div>
        <footer className={styles.footer}>
          <p>Tu coś kiedy bedzie</p>
        </footer>
      </div>
    </>
  );
};

export default MainPage;
