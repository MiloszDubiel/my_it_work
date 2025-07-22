import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { IoFilterOutline } from "react-icons/io5";
import { TbArrowNarrowDownDashed } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const showMenu = (e) => {
    if (e.currentTarget === e.target) {
      e.target.lastChild.classList.toggle(`${styles.showMenu}`);
      e.target.classList.toggle(`${styles.bordered}`);
      e.target.querySelector("svg").classList.toggle(`${styles.rotate}`);
    }
    if (e.target.tagName === "P" || e.target.tagName === "svg") {
      e.currentTarget.lastChild.classList.toggle(`${styles.showMenu}`);
      e.currentTarget.classList.toggle(`${styles.bordered}`);
      e.currentTarget.querySelector("svg").classList.toggle(`${styles.rotate}`);
    }
  };

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
          <div
            className={styles.localization}
            onClick={(e) => {
              showMenu(e);
            }}
          >
            <p>Lokalizacja</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>
            <div className={styles.localizations + " " + styles.showMenu}>
              <div className={styles.searchBox}>
                <CiSearch
                  style={{
                    position: "absolute",
                    left: 0,
                    transform: "translateX(23px)",
                    color: "grey",
                  }}
                />
                <input
                  type="text"
                  id="searchLocalization"
                  placeholder="Szukaj..."
                />
              </div>
              <div className={styles.options}>
                <p>Remote</p>
                <p>Rzeszów</p>
                <p>Kraków</p>
                <p>Warszawa</p>
                <p>Poznań</p>
                <p>Opole</p>
                <p>Katowice</p>
                <p>Wrocław</p>
              </div>
            </div>
          </div>
          <div
            className={styles.position}
            onClick={(e) => {
              showMenu(e);
            }}
          >
            <p>Stanowisko</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>
            <div className={styles.positions + " " + styles.showMenu}>
              <div className={styles.searchBox}>
                <CiSearch
                  style={{
                    position: "absolute",
                    left: 0,
                    transform: "translateX(23px)",
                    color: "grey",
                  }}
                />
                <input
                  type="text"
                  id="searchLocalization"
                  placeholder="Szukaj..."
                />
              </div>
              <div className={styles.options}>
                <p>Remote</p>
                <p>Rzeszów</p>
                <p>Kraków</p>
                <p>Warszawa</p>
                <p>Poznań</p>
                <p>Opole</p>
                <p>Katowice</p>
                <p>Wrocław</p>
              </div>
            </div>
          </div>
          <div
            className={styles.technologie}
            onClick={(e) => {
              showMenu(e);
            }}
          >
            <p>Technologia</p>
            <p className={styles.arrow}>
              <TbArrowNarrowDownDashed />
            </p>
            <div className={styles.technologies + " " + styles.showMenu}>
              <div className={styles.searchBox}>
                <CiSearch
                  style={{
                    position: "absolute",
                    left: 0,
                    transform: "translateX(23px)",
                    color: "grey",
                  }}
                />
                <input
                  type="text"
                  id="searchLocalization"
                  placeholder="Szukaj..."
                />
              </div>
              <div className={styles.options}>
                <p>Remote</p>
                <p>Rzeszów</p>
                <p>Kraków</p>
                <p>Warszawa</p>
                <p>Poznań</p>
                <p>Opole</p>
                <p>Katowice</p>
                <p>Wrocław</p>
              </div>
            </div>
          </div>
          <div className={styles.filter}>
            <p>
              <IoFilterOutline />
            </p>
            <p>Filtruj</p>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
