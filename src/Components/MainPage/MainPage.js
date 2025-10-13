import styles from "./MainPage.module.css";
import Navbar from "../NavBar/NavBar";
import { Link } from "react-router-dom";


const MainPage = () => {

  






  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Znajdź swoją wymarzoną pracę IT 🚀</h1>
          <p>
            Przeglądaj oferty pracy, poznaj firmy i aplikuj w kilka kliknięć.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/job-offers" className={styles.btnPrimary}>
              Przeglądaj oferty
            </Link>
            <Link to="/register" className={styles.btnSecondary}>
              Dołącz teraz
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className={styles.jobsSection}>
        <h2>Najnowsze oferty</h2>
        <div className={styles.jobsGrid}>
          <div className={styles.jobCard}>
            <h3>Frontend Developer</h3>
            <p>TechCorp Sp. z o.o.</p>
            <span>Warszawa • Umowa o pracę</span>
            <Link to="/job-offers/1" className={styles.detailsBtn}>
              Szczegóły
            </Link>
          </div>

          <div className={styles.jobCard}>
            <h3>Backend Developer (Node.js)</h3>
            <p>Softify</p>
            <span>Kraków • B2B</span>
            <Link to="/job-offers/2" className={styles.detailsBtn}>
              Szczegóły
            </Link>
          </div>

          <div className={styles.jobCard}>
            <h3>DevOps Engineer</h3>
            <p>CloudX</p>
            <span>Remote • B2B</span>
            <Link to="/job-offers/3" className={styles.detailsBtn}>
              Szczegóły
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.aboutSection}>
        <h2>Dlaczego my?</h2>
        <div className={styles.aboutGrid}>
          <div>
            <h3>Szybka rekrutacja</h3>
            <p>
              Aplikuj jednym kliknięciem, śledź statusy i komunikuj się z
              rekruterami w prosty sposób.
            </p>
          </div>
          <div>
            <h3>Sprawdzone firmy</h3>
            <p>Współpracujemy tylko z renomowanymi pracodawcami z branży IT.</p>
          </div>
          <div>
            <h3>Personalizowane oferty</h3>
            <p>
              System dopasuje oferty do Twojego profilu i doświadczenia
              zawodowego.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
