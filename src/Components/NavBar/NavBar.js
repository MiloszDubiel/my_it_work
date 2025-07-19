import { useRef } from "react";
import styles from "./navbar.module.css";
import { CiSearch } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
const Navbar = () => {
  let searchBar = useRef(null);
  return (
    <nav className={styles.navBar}>
      <div className={styles.header}>
        <h3>MyITWork</h3>
        <div className={styles.searchBar}>
          <label
            htmlFor="search"
            onClick={() => {
              searchBar.current.classList.toggle(`${styles.hiddenBar}`);
            }}
          >
            <CiSearch className={styles.searchIcon} />
          </label>
          <div
            ref={searchBar}
            className={styles.hiddenBar + " " + styles.barDiv}
          >
            <input
              type="search"
              id="search"
              className={styles.searchBarInput}
              placeholder="Szukaj ofert"
            />
          </div>
        </div>
      </div>
      <div className={styles.account}>
        <button>
          <VscAccount className={styles.icon} />
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
