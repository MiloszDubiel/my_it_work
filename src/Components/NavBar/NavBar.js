import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { TbArrowNarrowDownDashed, TbArrowNarrowUpDashed } from "react-icons/tb";

const Navbar = () => {
  return (
    <header className={styles.headerElement}>
      <nav className={styles.navBar}>
        <div className={styles.header}>
          <h3>MyITWork</h3>
        </div>
        <div className={styles.list}>
          <ul>
            <li>Oferty pracy</li>
            <li>Pracodawcy IT</li>
            <li>Kandydaci IT</li>
          </ul>
        </div>
        <div className={styles.account}>
          <div className={styles.addOffert}>
            <p>Dodaj ogłoszenie</p>
          </div>
          <button>
            <IoPersonOutline className={styles.icon} />
          </button>
        </div>
      </nav>
      <div className={styles.searchDiv}>
        <h1>Rekrutacja IT, bez zbędnego kodu.</h1>
        <div className={styles.formDiv}>
          <div className={styles.localization}>
            <p>Lokalizacja</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>
          </div>
          <div className={styles.position}>
            <p>Stanoiwisko</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>

          </div>
          <div className={styles.technologies}>
            <p>Technologia</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>
          </div>
          <div className={styles.filter}>
            <p></p>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
