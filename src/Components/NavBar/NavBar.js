import { IoPersonOutline } from "react-icons/io5";
import styles from "./navbar.module.css";
import { IoFilterOutline } from "react-icons/io5";
import { TbArrowNarrowDownDashed } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useRef, useEffect } from "react";

const Navbar = () => {
  let hiddenMenu = useRef(null);
  let searchDiv = useRef(null);

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
    e.currentTarget.classList.toggle(styles.toggleColor);
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
          parent.firstChild?.classList.add(styles.hideH1);
          parent.children[1]?.classList.add(styles.moveUp);
          parent.classList.add(styles.smallSearchDiv);
        } else {
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
      <div className={styles.searchDiv} ref={searchDiv}>
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
            </div>
            <div className={styles.experienceDiv}>
              <p style={{ fontWeight: "bolder", margin: 0 }}>
                Poziom doświadczenia
              </p>
              <div className={styles.experiencesTypes}>
                <p onClick={(e) => toggleStyle(e)}>Intern</p>
                <p onClick={(e) => toggleStyle(e)}>Junior</p>
                <p onClick={(e) => toggleStyle(e)}>Senior</p>
                <p onClick={(e) => toggleStyle(e)}>Lead/Principal</p>
              </div>
            </div>
            <div className={styles.contract}>
              <p style={{ fontWeight: "bolder", margin: 0 }}>Typ umowy</p>
              <div className={styles.contractTypes}>
                <p onClick={(e) => toggleStyle(e)}>Umowa B2B</p>
                <p onClick={(e) => toggleStyle(e)}>Umowa o prace</p>
                <p onClick={(e) => toggleStyle(e)}>Umowa zlecenie</p>
              </div>
            </div>
            <hr />
            <div className={styles.saleryDiv}>
              <p style={{ fontWeight: "bolder", margin: 0 }}>Wypłata</p>
              <div className={styles.moneyDiv}>
                <input
                  type="number"
                  min={0}
                  max={50_000}
                  className={styles.money}
                  placeholder="Minimalna"
                />
                <p>-</p>
                <input
                  placeholder="Maksymalna"
                  type="number"
                  min={0}
                  max={50_000}
                  className={styles.money}
                />
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
