import styles from "./navbar.module.css";
import { CiSearch } from "react-icons/ci";
const Navbar = () => {
  return (
    <nav className={styles.navBar}>
      <div className={styles.header}>
        <h3>MyITWork</h3>
        <div className={styles.searchBar}>
          <label htmlFor="search">
            <CiSearch />
          </label>
          <input type="search" id="search" />
        </div>
      </div>
      <div className={styles.account}>
        <button>Konto</button>
      </div>
    </nav>
  );
};
export default Navbar;
