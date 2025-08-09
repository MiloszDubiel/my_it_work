import styles from "./MainPage.module.css";
import NewJobOfferts from "../NewJobOfferts/NewJobOfferts";
import jobOfertsStyle from "../JobOffertDetails/jobDetails.module.css";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Fotter";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <>
      <div className={styles.page}>
        <Navbar offertPage={true} />
        <h1 className={styles.header}>Praca w IT</h1>
        <h2 className={styles.header} style={{ marginTop: 0 }}>
          Najnowsze oferty pracy
        </h2>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <NewJobOfferts
              amount={9}
              styles={styles}
              ofertDetailsStyle={jobOfertsStyle}
            />
          </div>
        </div>
        <div className={styles.showMoreOfferts}>
          {" "}
          <Link
            to={"/job-offerts"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <button> Pokaż więcej</button>
          </Link>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainPage;
