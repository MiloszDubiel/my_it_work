import styles from "./MainPage.module.css";
import NewJobOfferts from "../NewJobOfferts/NewJobOfferts";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Fotter";
import { IoFilterOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Filter from "../FilterComponent/Filter";

const MainPage = () => {
  return (
    <>
      <div className={styles.page}>
        <Navbar offertPage={true} />
        <Filter offertPage={true} />
        <h1 className={styles.header}>Praca w IT</h1>
        <h2 className={styles.header} style={{ marginTop: 0 }}>
          Najnowsze oferty pracy{" "}
          <button
            onClick={() => {
              document.querySelector("#filter").style.display = "flex";
            }}
          >
            Filtruj
          </button>
        </h2>
        <div className={styles.recommended}>
          <div className={styles.parent}>
            <NewJobOfferts amount={9} />
          </div>
        </div>
        <div className={styles.showMoreOfferts}>
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
