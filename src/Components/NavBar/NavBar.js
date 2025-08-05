import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { IoFilterOutline } from "react-icons/io5";
import { TbArrowNarrowDownDashed } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ offertPage, candidatePage, employersPage }) => {
  let hiddenMenu = useRef(null);
  let searchDiv = useRef(null);
  let account = useRef(null);

  const showMenu = (e) => {
    if (e.currentTarget === e.target) {
      e.target.lastChild.classList.toggle(styles.showMenu);
      e.target.classList.toggle(styles.bordered);
      e.target.querySelector("svg").classList.toggle(styles.rotate);
    }
    if (e.target.tagName === "P" || e.target.tagName === "svg") {
      e.currentTarget.lastChild.classList.toggle(styles.showMenu);
      e.currentTarget.classList.toggle(styles.bordered);
      e.currentTarget.querySelector("svg").classList.toggle(styles.rotate);
    }
  };

  const toggleStyle = (e) => {
    if (e.target.tagName === "P") {
      e.target.classList.toggle(styles.toggleColor);
    }
  };

  const toggleFilter = () => {
    hiddenMenu.current.classList.toggle(styles.toggleFilter);
  };

  useEffect(() => {
    const handleScroll = () => {
      const parent = searchDiv.current;
      if (!parent) return;
      window.requestAnimationFrame(() => {
        if (window.scrollY > 10 && window.innerWidth > 768) {
          parent.parentElement.classList.add(styles.smallHeader);
          parent.firstChild?.classList.add(styles.hideH1);
          parent.children[1]?.classList.add(styles.moveUp);
          parent.classList.add(styles.smallSearchDiv);
        } else {
          parent.parentElement.classList.remove(styles.smallHeader);
          parent.firstChild?.classList.remove(styles.hideH1);
          parent.children[1]?.classList.remove(styles.moveUp);
          parent.classList.remove(styles.smallSearchDiv);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={styles.headerElement}>
      <nav className={styles.navBar}>
        <div className={styles.header}>
          <h3>MyITWork</h3>
        </div>
        <div className={styles.list}>
          <ul>
            <li>
              {" "}
              <Link
                to="/job-offerts"
                style={{ textDecoration: "none", color: "black" }}
              >
                Oferty pracy
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to="/employers"
                style={{ textDecoration: "none", color: "black" }}
              >
                Pracodawcy IT
              </Link>
            </li>
            <li>
              <Link
                to="/candidates"
                style={{ textDecoration: "none", color: "black" }}
              >
                Kandydaci IT
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.account}>
          <div className={styles.addOffert}>
            <p>Dodaj ogłoszenie</p>
          </div>
          <button
            onClick={() => {
              account.current.classList.toggle(styles.accountDivHide);
            }}
          >
            <IoPersonOutline className={styles.icon} />
          </button>
        </div>
        <div
          className={styles.accountDiv + " " + styles.accountDivHide}
          ref={account}
        >
          <Link to="/login">Zaloguj się</Link>
          <Link to="/register">Zarejestruj się</Link>
        </div>
      </nav>
      <div
        className={
          styles.searchDiv +
          " " +
          (employersPage
            ? styles.darkSearchDiv
            : candidatePage
            ? styles.blueSearchDiv
            : styles.orangeSearchDiv)
        }
        ref={searchDiv}
      >
        <h1>
          {offertPage
            ? "Rekrutacja IT, bez zbędnego kodu."
            : employersPage
            ? "Firmy IT"
            : "Kandydaci IT"}
        </h1>
        <div className={styles.formDiv}>
          {offertPage ? (
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
          ) : employersPage ? (
            <input
              type="text"
              className={styles.localization + " " + styles.searchInput}
              placeholder="Nazwa firmy"
            />
          ) : (
            ""
          )}

          {offertPage ? (
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
          ) : employersPage ? (
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
          ) : (
            ""
          )}

          <div
            className={styles.technologie + " " + styles.toHide}
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
                <p>JavaScript</p>
                <p>Java</p>
                <p>C</p>
                <p>C#</p>
                <p>C++</p>
                <p>PHP</p>
                <p>Kotlin</p>
                <p>Python</p>
              </div>
            </div>
          </div>
          {offertPage ? (
            <div
              className={styles.filter}
              onClick={(e) => {
                toggleFilter(e);
              }}
            >
              <p>
                <IoFilterOutline />
              </p>
              <p>Filtruj</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles.hiddenMenu}>
        <button onClick={toggleFilter}>
          {" "}
          <CiSearch />
          Wyszukuj oferty
        </button>
      </div>
      <div
        className={styles.searchOffertsDiv + " " + styles.toggleFilter}
        ref={hiddenMenu}
      >
        <div className={styles.searchOfferts}>
          <div className={styles.closeWindow}>
            <p style={{ fontSize: "26px" }}>Filtruj oferty</p>
            <IoCloseOutline onClick={toggleFilter} />
          </div>
          <div className={styles.mainFilters}>
            <div className={styles.optionsFilter}>
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
                    <p>JavaScript</p>
                    <p>Java</p>
                    <p>C</p>
                    <p>C#</p>
                    <p>C++</p>
                    <p>PHP</p>
                    <p>Kotlin</p>
                    <p>Python</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.experienceDiv}>
              <p style={{ fontWeight: "bolder", margin: 0 }}>
                Poziom doświadczenia
              </p>
              <div
                className={styles.experiencesTypes}
                onClick={(e) => toggleStyle(e)}
              >
                <p>Intern</p>
                <p>Junior</p>
                <p>Senior</p>
                <p>Lead/Principal</p>
              </div>
            </div>
            <div className={styles.contract}>
              <p style={{ fontWeight: "bolder", margin: 0 }}>Typ umowy</p>
              <div
                className={styles.contractTypes}
                onClick={(e) => toggleStyle(e)}
              >
                <p>Umowa B2B</p>
                <p>Umowa o prace</p>
                <p>Umowa zlecenie</p>
              </div>
            </div>
          </div>
          <div className={styles.setFilter}>
            <button>Resetuj</button>
            <button>Zastosuj</button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
