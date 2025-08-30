import styles from "./filter.module.css";
import { TbArrowNarrowDownDashed } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { Link } from "react-router-dom";

const Filter = ({ offertPage, candidatePage, employersPage }) => {
  //Stałe do wyszukwania - Lokalizacja
  const [cities, setCities] = useState(null);
  const [currentCity, setCurrentCity] = useState("");

  //Stałe do wyszukwania  - Stanowisko
  const [positions, setPositions] = useState(null);
  const [currentPosition, setCurrentPosition] = useState("");

  //Stałe do wyszukiwania  - Technologia
  const [technology, setTechnology] = useState(null);
  const [currentTechnology, setCurrentTechnology] = useState("");

  //Parametry przekzywane do strony /filltred-job-offerts
  const [parma, setParma] = useState([]);

  //Metoda do wysiwetlania osobno pol - Lokalizacja Stanowisko i yechnologia
  const showMenu = (e, variant) => {
    let menu = e.currentTarget.querySelector("div");

    if (
      (e.target.tagName === "P" && !e.target.classList.contains("name")) ||
      e.target.tagName === "INPUT"
    ) {
      return;
    }
    menu.classList.toggle(styles.showMenu);
  };

  //Zmiana styli
  const toggleStyle = (e) => {
    if (e.target.tagName === "P") {
      e.target.classList.toggle(styles.toggleColor);
    }
  };

  //Funkcja do wyszukiwania opcji w polach Lokalizacja, Stanowisko i Technologia
  const searchOptions = (e, options) => {
    const text = String(e.currentTarget.value).toLowerCase().trim();

    const filteredElements = options
      .filter((el) => el.toLowerCase().trim().includes(text))
      .map((tag) => {
        return <p>{tag[0].toUpperCase() + tag.substr(1)}</p>;
      });

    return filteredElements;
  };

  //Funkcja zo zebrania informacji które zaznaczył użytkownik w polach Technologia, Lokalizacja i Stanowisko i chce za pomoca nich filtrować i wyszukiwac ofert
  const toggleOption = (e) => {
    e.target.classList.toggle(styles.checked);
  };

  return (
    <>
      <div className={styles.searchOffertsDiv} id="filter">
        <div className={styles.searchOfferts}>
          <div className={styles.closeWindow}>
            <p style={{ fontSize: "26px" }}>Filtruj oferty</p>
            <IoCloseOutline
              onClick={() => {
                document.querySelector("#filter").style.display = "none";
              }}
            />
          </div>
          <div className={styles.mainFilters}>
            <div className={styles.optionsFilter}>
              <div
                className={styles.localization}
                onClick={(e) => {
                  showMenu(e, styles.localizations);
                }}
              >
                <p className="name">Lokalizacja</p>
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
                      onKeyUpCapture={(e) => {
                        setCities(
                          searchOptions(e, [
                            "Remote",
                            "Rzeszów",
                            "Kraków",
                            "Warszawa",
                            "Poznań",
                            "Opole",
                            "Katowice",
                            "Wrocław",
                            "Białystok",
                            "Polska",
                            "Łódź",
                          ])
                        );
                      }}
                    />
                  </div>
                  <div className={styles.options}>
                    {cities == null ? (
                      <span
                        onClick={(e) => {
                          toggleOption(e);
                        }}
                      >
                        <p>Remote</p>
                        <p>Rzeszów</p>
                        <p>Kraków</p>
                        <p>Warszawa</p>
                        <p>Poznań</p>
                        <p>Opole</p>
                        <p>Katowice</p>
                        <p>Wrocław</p>
                        <p>Białystok</p>
                        <p>Polska</p>
                        <p>Łódź</p>
                      </span>
                    ) : (
                      cities
                    )}
                  </div>
                </div>
              </div>
              {offertPage ? (
                <div
                  className={styles.position}
                  onClick={(e) => {
                    showMenu(e, styles.positions);
                  }}
                >
                  <p className="name">Stanowisko</p>
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
                        onKeyUpCapture={(e) => {
                          setPositions(
                            searchOptions(e, [
                              "Backend",
                              "Analityk IT",
                              "DevOps",
                              "Frontend",
                              "Administrator IT",
                              "Full-stack",
                              "Architekt IT",
                              "Cyber Seciurity",
                              "GameDev",
                              "Data Science",
                              "Embedded",
                            ])
                          );
                        }}

                      />
                    </div>
                    <div className={styles.options}>
                      {positions == null ? (
                        <span
                          onClick={(e) => {
                            toggleOption(e);
                          }}
                        >
                          <p>Backend</p>
                          <p>Analityk IT</p>
                          <p>DevOps</p>
                          <p>Frontend</p>
                          <p>Administrator IT</p>
                          <p>Full-stack</p>
                          <p>Architekt IT</p>
                          <p>Cyber Seciurity</p>
                          <p>GameDev</p>
                          <p>Data Science</p>
                          <p>Embedded</p>
                        </span>
                      ) : (
                        positions
                      )}
                    </div>
                  </div>
                </div>
              ) : employersPage ? (
                <div className={styles.position}>
                  <input
                    type="text"
                    className={styles.companyName}
                    placeholder="Nazwa firmy"
                  />
                </div>
              ) : (
                <div className={styles.position}>
                  <input
                    type="text"
                    className={styles.name}
                    placeholder="Imię"
                  />
                  <input
                    type="text"
                    className={styles.name}
                    placeholder="Nazwisko"
                  />
                </div>
              )}
              <div
                className={styles.technologie}
                onClick={(e) => {
                  showMenu(e, styles.technologies);
                }}
              >
                <p className="name">Technologia</p>
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
                      onKeyUpCapture={(e) => {
                        setTechnology(
                          searchOptions(e, [
                            "JavaScript",
                            "TypeScript",
                            "Java",
                            "C",
                            "C#",
                            "C++",
                            "PHP",
                            "Kotlin",
                            "Phyton",
                            ".NET",
                            "SQL",
                          ])
                        );
                      }}
                    />
                  </div>
                  <div className={styles.options}>
                    {technology == null ? (
                      <span
                        onClick={(e) => {
                          toggleOption(e);
                        }}
                      >
                        <p>JavaScript</p>
                        <p>TypeScript</p>
                        <p>Java</p>
                        <p>C</p>
                        <p>C#</p>
                        <p>PHP</p>
                        <p>Kotlin</p>
                        <p>Phyton</p>
                        <p>.NET</p>
                        <p>SQL</p>
                      </span>
                    ) : (
                      technology
                    )}
                  </div>
                </div>
              </div>
            </div>
            {offertPage ? (
              <>
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
                    <p>Kontrakt B2B</p>
                    <p>Umowa o pracę</p>
                    <p>Umowa zlecenie</p>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className={styles.setFilter}>
            {offertPage ? (
              <Link
                to="/job-offerts/filltred"
                state={{ parma }}
                onClick={() => {
                  const locations = [
                    ...document.querySelectorAll(
                      `.${styles.localizations} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const position = [
                    ...document.querySelectorAll(
                      `.${styles.positions} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const technologie = [
                    ...document.querySelectorAll(
                      `.${styles.technologies} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const exprience = [
                    ...document.querySelectorAll(`.${styles.experienceDiv} p`),
                  ]
                    .filter((el) => el.classList.contains(styles.toggleColor))
                    .map((tag) => tag.textContent);

                  const type = [
                    ...document.querySelectorAll(`.${styles.contractTypes} p`),
                  ]
                    .filter((el) => el.classList.contains(styles.toggleColor))
                    .map((tag) => tag.textContent);

                  const filters = {
                    locations,
                    position,
                    technologie,
                    exprience,
                    type,
                  };

                  setParma(filters);
                }}
              >
                {" "}
                Zastosuj
              </Link>
            ) : employersPage ? (
              <Link
                to="/employers/filltred"
                state={{ parma }}
                onClick={() => {
                  const locations = [
                    ...document.querySelectorAll(
                      `.${styles.localizations} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const company = document.querySelector(
                    `.${styles.companyName}`
                  );

                  const technologie = [
                    ...document.querySelectorAll(
                      `.${styles.technologies} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);


                  const filters = {
                    locations,
                    company,
                    technologie,
                  };

                  setParma(filters);
                }}
              >
                {" "}
                Zastosuj
              </Link>
            ) : (
              <Link
                to="/job-offerts/filltred"
                state={{ parma }}
                onClick={(e) => {
                  const locations = [
                    ...document.querySelectorAll(
                      `.${styles.localizations} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const position = [
                    ...document.querySelectorAll(
                      `.${styles.positions} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const technologie = [
                    ...document.querySelectorAll(
                      `.${styles.technologies} .${styles.options} span p`
                    ),
                  ]
                    .filter((el) => el.classList.contains(styles.checked))
                    .map((tag) => tag.textContent);

                  const exprience = [
                    ...document.querySelectorAll(`.${styles.experienceDiv} p`),
                  ]
                    .filter((el) => el.classList.contains(styles.toggleColor))
                    .map((tag) => tag.textContent);

                  const type = [
                    ...document.querySelectorAll(`.${styles.contractTypes} p`),
                  ]
                    .filter((el) => el.classList.contains(styles.toggleColor))
                    .map((tag) => tag.textContent);

                  const filters = {
                    locations,
                    position,
                    technologie,
                    exprience,
                    type,
                  };

                  setParma(filters);
                }}
              >
                {" "}
                Zastosuj
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
