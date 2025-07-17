import React from "react";
import Navbar from "../NavBar/NavBar";
import styles from "./MainPage.module.css";
import C from "../../Icons/C.png";
const MainPage = () => {
  const switchClass = (e) => {
    e.currentTarget.classList.toggle(`${styles.checked}`);
  };

  const showMenu = (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget
        .querySelector("div")
        .classList.toggle(`${styles.showMenu}`);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.parent}>
          <div className={styles.div1}>
            <h1>Znajdź z nami szybko pracę w branży IT</h1>
          </div>
          <div className={styles.div2}>
            <div className={styles.searchBox}>
              <form>
                <div className={styles.form1}>
                  <div
                    className={styles.search}
                    onClick={(e) => {
                      showMenu(e);
                    }}
                  >
                    <p className={styles.formHeaders}>Tryb pracy</p>
                    <div className={styles.wrapper + " " + styles.showMenu}>
                      <div className={styles.searchOptions}>
                        <p className={styles.headers}>Tryb pracy</p>
                        <div className={styles.tryby}>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Zdalnie
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Hybrydowo
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Stacjonarnie
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.location}
                    onClick={(e) => {
                      showMenu(e);
                    }}
                  >
                    <p className={styles.formHeaders}>Lokalizacja</p>
                    <div className={styles.wrapper + " " + styles.showMenu}>
                      <div className={styles.searchOptions}>
                        <p className={styles.headers}>Lokalizacja</p>
                        <div className={styles.tryby}>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Rzeszów
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Kraków
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Katowice
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Opole
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Wrocław
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Zielona Góra
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Szczecin
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Sopot
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Gdynia
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Bielsko-Biała
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Toruń
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Kielce
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Olsztyn
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.type}
                    onClick={(e) => {
                      showMenu(e);
                    }}
                  >
                    <p className={styles.formHeaders}> Typ umowy</p>
                    <div className={styles.wrapper + " " + styles.showMenu}>
                      <div className={styles.searchOptions}>
                        <p className={styles.headers}>Typ umowy</p>
                        <div className={styles.tryby}>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Umowa o pracę
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            B2B
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Umowa zlecenie
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.experience}
                    onClick={(e) => {
                      showMenu(e);
                    }}
                  >
                    <p className={styles.formHeaders}>Poziom doświadczenia</p>
                    <div className={styles.wrapper + " " + styles.showMenu}>
                      <div className={styles.searchOptions}>
                        <p className={styles.headers}>Poziom doświadczenia</p>
                        <div className={styles.tryby}>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Junior
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Mid
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Senior
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Head
                          </button>
                          <button
                            type="button"
                            onClick={(e) => switchClass(e)}
                            className={styles.specialization}
                          >
                            Manager
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.form3}>
                  <p>Specjalizacje</p>
                  <div className={styles.specializations}>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Backend
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Frontend
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Full-stack
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Mobile
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Architecture
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Embedded
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      UX/UI
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Helpdesk
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Data Science
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      IT admin
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      Testing
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.specialization}
                    >
                      GameDev
                    </button>
                  </div>
                </div>
                <div className={styles.form3}>
                  <p>Technologie</p>
                  <div className={styles.technologies}>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path d="M1.88 2h20v20h-20V2z" fill="#F0DB4F" />
                          <path
                            d="M20.243 17.23c-.146-.913-.741-1.679-2.503-2.394-.612-.28-1.295-.482-1.498-.946-.073-.27-.082-.422-.037-.586.132-.53.765-.696 1.267-.544.323.109.629.358.813.755.863-.559.861-.555 1.464-.939-.22-.342-.338-.5-.483-.646-.519-.58-1.226-.879-2.357-.856-.196.025-.394.052-.59.076-.564.143-1.102.44-1.418.837-.947 1.074-.677 2.954.476 3.728 1.135.852 2.802 1.046 3.015 1.842.207.975-.717 1.29-1.635 1.179-.677-.14-1.054-.485-1.46-1.11l-1.52.876c.183.4.375.58.681.926 1.449 1.47 5.074 1.397 5.725-.827.026-.076.201-.586.06-1.371zm-7.49-6.038h-1.87c0 1.616-.008 3.22-.008 4.837 0 1.028.053 1.971-.114 2.26-.274.568-.983.498-1.307.388-.328-.162-.496-.392-.69-.717-.053-.093-.093-.165-.106-.171-.508.31-1.013.622-1.521.931.253.52.625.97 1.103 1.263.713.428 1.67.559 2.673.329.652-.19 1.214-.584 1.51-1.183.425-.785.334-1.736.33-2.787.01-1.715 0-3.43 0-5.15z"
                            fill="#323330"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <rect
                              x="1.88"
                              y="2"
                              width="20"
                              height="20"
                              rx="2"
                              fill="#fff"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      JavaScript
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M5.101 19.905 3.64 2.033l17.464.036-1.546 17.836-7.12 2.062L5.1 19.905z"
                            fill="#E34F26"
                          />
                          <path
                            d="M12.437 20.24V3.736l7.192.024-1.283 14.767-5.91 1.715z"
                            fill="#EF652A"
                          />
                          <path
                            d="m17.65 7.859.205-2.182H6.79l.611 6.689h7.636l-.3 2.852-2.445.66-2.481-.72-.132-1.702H7.486l.3 3.476 4.507 1.259 4.543-1.259.611-6.784H9.428l-.227-2.29h8.45z"
                            fill="#fff"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(3.639 2)"
                              d="M0 0h17.464v20H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      HTML
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M19.38 16.541v1.844c0 1.443-3.49 2.615-7.5 2.615-4.008 0-7.5-1.172-7.5-2.615V16.54c1.814 1.304 5.254 1.692 7.5 1.692 2.255 0 5.691-.392 7.5-1.692zm-7.5-2.556c-2.254 0-5.69-.393-7.5-1.692v1.825c0 1.444 3.492 2.615 7.5 2.615 4.01 0 7.5-1.171 7.5-2.615v-1.825c-1.813 1.303-5.253 1.692-7.5 1.692zM11.88 3c-4.008 0-7.5 1.171-7.5 2.616s3.492 2.615 7.5 2.615c4.01 0 7.5-1.171 7.5-2.615C19.38 4.172 15.89 3 11.88 3zm0 6.731c-2.254 0-5.69-.392-7.5-1.692v1.83c0 1.445 3.492 2.616 7.5 2.616 4.01 0 7.5-1.172 7.5-2.616V8.04c-1.813 1.304-5.253 1.692-7.5 1.692z"
                            fill="#556CE4"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2.88 3)"
                              d="M0 0h18v18H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      SQL
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M11.759 3.005c-4.577 0-4.29 1.985-4.29 1.985l.004 2.056h4.367v.617H5.74S2.81 7.331 2.81 11.948c0 4.618 2.556 4.454 2.556 4.454h1.526V14.26s-.083-2.556 2.515-2.556h4.331s2.434.039 2.434-2.352V5.398s.37-2.393-4.413-2.393zM9.35 4.388a.785.785 0 1 1 .001 1.57.785.785 0 0 1-.001-1.57z"
                            fill="url(#b)"
                          />
                          <path
                            d="M11.889 20.938c4.576 0 4.29-1.984 4.29-1.984l-.005-2.056h-4.367v-.618h6.102s2.928.332 2.928-4.285c0-4.618-2.556-4.454-2.556-4.454h-1.525v2.143s.082 2.556-2.515 2.556H9.909s-2.433-.04-2.433 2.352v3.954s-.37 2.392 4.413 2.392zm2.408-1.382a.786.786 0 1 1 0-1.572.786.786 0 0 1 0 1.572z"
                            fill="url(#c)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="b"
                            x1="176.049"
                            y1="164.304"
                            x2="1069.41"
                            y2="1048.75"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#387EB8" />
                            <stop offset="1" stop-color="#366994" />
                          </linearGradient>
                          <linearGradient
                            id="c"
                            x1="263.176"
                            y1="283.258"
                            x2="1222.54"
                            y2="1190.18"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#FFE052" />
                            <stop offset="1" stop-color="#FFC331" />
                          </linearGradient>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2.8 3)"
                              d="M0 0h18.072v18H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      Python
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <clipPath id="a">
                            <path d="M5 13h14.8v8H5zm0 0" />
                          </clipPath>
                          <clipPath id="b">
                            <path d="M9 3.23h6V14H9zm0 0" />
                          </clipPath>
                          <clipPath id="c">
                            <path d="M7 19h12.8v2.691H7zm0 0" />
                          </clipPath>
                        </defs>
                        <path d="M9.773 17.504s-.765.406.543.547c1.582.168 2.391.14 4.133-.164 0 0 .457.265 1.098.496-3.906 1.547-8.844-.09-5.774-.88zm-.48-2.02s-.855.586.453.711c1.688.16 3.024.172 5.332-.238 0 0 .32.3.824.465-4.726 1.273-9.988.098-6.609-.938zm0 0" />
                        <path d="M13.32 12.063c.965 1.023-.254 1.945-.254 1.945s2.446-1.168 1.325-2.625c-1.051-1.36-1.856-2.04 2.5-4.367 0 0-6.836 1.574-3.57 5.046zm0 0" />
                        <g clip-path="url(#a)">
                          <path
                            style={{
                              stroke: "none",
                              fillRule: "nonzero",
                              fill: "#5382a1",
                              fillOpacity: 1,
                            }}
                            d="M18.488 18.996s.567.43-.62.762c-2.255.629-9.391.82-11.372.023-.71-.285.625-.683 1.043-.765.441-.09.691-.07.691-.07-.793-.516-5.12 1.011-2.199 1.445 7.969 1.195 14.524-.536 12.457-1.395zm-8.351-5.601s-3.625.796-1.282 1.085c.989.122 2.961.094 4.797-.05a41.449 41.449 0 0 0 3.012-.364s-.531.207-.914.45c-3.684.894-10.8.48-8.754-.438 1.734-.773 3.14-.683 3.14-.683zm6.511 3.359c3.747-1.797 2.012-3.524.805-3.293-.297.059-.43.105-.43.105s.11-.156.32-.226c2.391-.777 4.231 2.289-.769 3.504 0 0 .055-.047.074-.09zm0 0"
                          />
                        </g>
                        <g clip-path="url(#b)">
                          <path
                            style={{
                              stroke: "none",
                              fillRule: "nonzero",
                              fill: "#e76f00",
                              fillOpacity: 1,
                            }}
                            d="M14.39 3.25s2.075 1.918-1.968 4.863c-3.242 2.36-.738 3.707 0 5.246-1.895-1.574-3.281-2.96-2.352-4.254 1.367-1.894 5.157-2.812 4.32-5.855zm0 0"
                          />
                        </g>
                        <g clip-path="url(#c)">
                          <path
                            style={{
                              stroke: "none",
                              fillRule: "nonzero",
                              fill: "#5382a1",
                              fillOpacity: 1,
                            }}
                            d="M10.508 21.621c3.594.211 9.117-.117 9.246-1.687 0 0-.25.593-2.973 1.066-3.066.535-6.851.473-9.097.129 0 0 .46.351 2.824.492zm0 0"
                          />
                        </g>
                      </svg>
                      Java
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M12 16.887c5.523 0 10-2.33 10-5.205s-4.477-5.206-10-5.206S2 8.807 2 11.682c0 2.875 4.477 5.205 10 5.205z"
                            fill="#8993BE"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="m4.808 14.764 1.096-5.548h2.534c1.096.069 1.644.617 1.644 1.575 0 1.644-1.301 2.603-2.466 2.535H6.384l-.274 1.438H4.808zm1.85-2.466L7 10.243h.89c.48 0 .822.206.822.617-.068 1.164-.616 1.37-1.233 1.438h-.822zm3.17 1.028 1.095-5.548h1.302l-.274 1.438h1.232c1.096.069 1.507.617 1.37 1.302l-.479 2.808h-1.37l.48-2.535c.068-.342.068-.548-.411-.548h-1.028l-.616 3.083H9.827zm4.158 1.438 1.096-5.548h2.534c1.096.069 1.644.617 1.644 1.575 0 1.644-1.301 2.603-2.466 2.535h-1.232l-.274 1.438h-1.302zm1.85-2.466.342-2.055h.89c.48 0 .822.206.822.617-.068 1.164-.616 1.37-1.233 1.438h-.822z"
                            fill="#232531"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2 6.476)"
                              d="M0 0h20v10.472H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      PHP
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.924 8.321c0-.297-.064-.566-.196-.79a1.492 1.492 0 0 0-.571-.557c-2.109-1.216-4.223-2.431-6.332-3.647-.571-.327-1.118-.317-1.684.015-.84.493-5.048 2.905-6.298 3.632-.518.298-.767.757-.767 1.352v7.343c0 .293.064.552.186.776.127.23.322.425.58.576 1.256.728 5.459 3.134 6.299 3.632.566.332 1.118.347 1.684.015 2.11-1.22 4.223-2.431 6.332-3.647.264-.151.454-.342.581-.576.122-.224.186-.483.186-.776V8.32z"
                          fill="#9A4993"
                        />
                        <path
                          d="M12.02 11.968 4.252 16.44c.127.23.322.425.581.576 1.255.728 5.458 3.135 6.298 3.633.566.332 1.118.346 1.684.014 2.11-1.22 4.223-2.431 6.332-3.647.264-.151.454-.341.581-.576l-7.709-4.472z"
                          fill="#6A1577"
                        />
                        <path
                          d="M9.72 13.291a2.623 2.623 0 0 0 2.275 1.323c.981 0 1.836-.537 2.285-1.337l-2.26-1.309-2.3 1.323z"
                          fill="#6A1577"
                        />
                        <path
                          d="M19.924 8.321c0-.297-.064-.566-.196-.79l-7.709 4.437 7.719 4.472a1.6 1.6 0 0 0 .186-.776V8.321z"
                          fill="#813084"
                        />
                        <path
                          d="M14.28 13.277a2.624 2.624 0 0 1-2.285 1.337 2.61 2.61 0 0 1-2.275-1.323 2.619 2.619 0 0 1 4.54-2.612l2.29-1.318a5.268 5.268 0 0 0-4.56-2.631 5.262 5.262 0 1 0 .005 10.526A5.266 5.266 0 0 0 16.57 14.6l-2.29-1.323zm2.895-2.53h-.523v2.525h.523v-2.524zm1.157 0h-.523v2.525h.523v-2.524z"
                          fill="#fff"
                        />
                        <path
                          d="M18.757 11.172h-2.524v.523h2.524v-.523zm0 1.153h-2.524v.522h2.524v-.522z"
                          fill="#fff"
                        />
                      </svg>
                      C#
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <img src={C} />
                      C++
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M20.047 2H3.953A1.953 1.953 0 0 0 2 3.953v16.094C2 21.126 2.874 22 3.953 22h16.094A1.953 1.953 0 0 0 22 20.047V3.953A1.953 1.953 0 0 0 20.047 2z"
                            fill="#3178C6"
                          />
                          <path
                            d="M20.047 2H3.953A1.953 1.953 0 0 0 2 3.953v16.094C2 21.126 2.874 22 3.953 22h16.094A1.953 1.953 0 0 0 22 20.047V3.953A1.953 1.953 0 0 0 20.047 2z"
                            fill="#3178C6"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M14.38 17.915v1.956a4.14 4.14 0 0 0 1.128.366c.434.082.892.122 1.373.122a6.41 6.41 0 0 0 1.336-.134c.421-.09.791-.237 1.11-.443.317-.206.569-.475.754-.807.186-.332.278-.742.278-1.231 0-.354-.053-.665-.159-.932a2.178 2.178 0 0 0-.458-.712c-.2-.208-.44-.394-.718-.56a7.705 7.705 0 0 0-.945-.467 11.868 11.868 0 0 1-.69-.308 3.503 3.503 0 0 1-.52-.306 1.33 1.33 0 0 1-.33-.33.695.695 0 0 1-.117-.394c0-.134.035-.255.104-.364.07-.107.167-.2.294-.277a1.57 1.57 0 0 1 .464-.18c.184-.044.388-.065.612-.065a4.11 4.11 0 0 1 1.064.15c.183.05.361.115.534.192.174.078.334.167.48.27v-1.828a4.77 4.77 0 0 0-.975-.254 7.944 7.944 0 0 0-1.213-.082c-.465 0-.905.05-1.32.15-.417.1-.782.255-1.098.467a2.335 2.335 0 0 0-.75.81c-.183.328-.274.72-.274 1.176 0 .583.168 1.08.504 1.491.336.412.847.76 1.531 1.045.27.11.52.218.752.324.233.106.433.216.603.33.169.114.302.238.4.373a.76.76 0 0 1 .055.81.813.813 0 0 1-.278.28c-.124.08-.28.142-.465.187a2.794 2.794 0 0 1-.65.067 3.758 3.758 0 0 1-2.415-.892zm-3.287-4.818h2.509v-1.605H6.609v1.605h2.497v7.145h1.987v-7.145z"
                            fill="#fff"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2 2)"
                              d="M0 0h20v20H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      TypeScript
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)" fill="#8CC84B">
                          <path d="M11.437 3.228a1.503 1.503 0 0 1 1.467 0c2.233 1.263 4.468 2.523 6.701 3.786.42.236.701.704.697 1.188v7.594c.003.504-.306.982-.749 1.214l-6.678 3.767a1.46 1.46 0 0 1-1.483-.042c-.667-.386-1.336-.771-2.003-1.158-.137-.081-.29-.146-.387-.278.085-.115.237-.13.361-.18.279-.088.535-.23.79-.368.065-.045.144-.028.206.012.571.327 1.137.664 1.71.988.122.07.245-.023.35-.081 2.185-1.235 4.372-2.465 6.556-3.7a.217.217 0 0 0 .12-.214V8.241a.235.235 0 0 0-.14-.234l-6.654-3.751a.23.23 0 0 0-.261 0C9.82 5.506 7.604 6.758 5.386 8.008a.232.232 0 0 0-.14.233v7.516a.212.212 0 0 0 .12.21c.592.336 1.185.67 1.777 1.004.334.18.743.286 1.111.149a.843.843 0 0 0 .546-.792c.003-2.49-.002-4.981.002-7.471-.008-.11.097-.202.204-.192.285-.002.57-.004.854.001.119-.003.2.116.186.228-.002 2.506.003 5.012-.002 7.518 0 .668-.274 1.395-.892 1.722-.76.394-1.702.31-2.453-.068-.651-.325-1.273-.708-1.912-1.056a1.391 1.391 0 0 1-.748-1.214V8.202c-.005-.494.287-.97.72-1.203l6.678-3.77z" />
                          <path d="M13.378 8.489c.971-.063 2.01-.037 2.884.44.677.367 1.052 1.137 1.064 1.888-.02.101-.125.157-.222.15-.282 0-.563.004-.845-.002-.12.005-.19-.105-.204-.21-.081-.36-.277-.716-.616-.89-.52-.26-1.121-.247-1.688-.241-.413.022-.858.057-1.209.3-.268.185-.35.557-.254.856.09.215.338.285.542.349 1.17.306 2.41.275 3.557.678.475.164.94.483 1.103.98.212.667.12 1.464-.355 2-.385.44-.945.68-1.504.81-.744.166-1.515.17-2.27.097-.71-.082-1.449-.268-1.997-.752-.468-.407-.697-1.04-.675-1.653.006-.103.109-.175.208-.166.284-.003.567-.003.85 0 .114-.008.198.09.204.197.052.342.181.702.48.905.576.372 1.3.346 1.96.357.547-.025 1.16-.032 1.607-.393.235-.207.305-.552.242-.848-.07-.25-.332-.368-.557-.444-1.155-.365-2.408-.233-3.552-.646-.465-.164-.914-.474-1.092-.951-.249-.676-.135-1.51.39-2.028.51-.514 1.248-.712 1.95-.783z" />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(4 3)"
                              d="M0 0h16.344v18H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      Node.js
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)" fill="#61DAFB">
                          <path d="M21 12.002c0-1.206-1.51-2.349-3.825-3.058.534-2.36.296-4.237-.75-4.838a1.627 1.627 0 0 0-.831-.208v.828a.86.86 0 0 1 .423.096c.505.29.724 1.392.553 2.809-.04.349-.108.716-.19 1.09a17.978 17.978 0 0 0-2.355-.404c-.501-.686-1.02-1.31-1.544-1.855 1.21-1.124 2.345-1.74 3.117-1.74v-.827c-1.02 0-2.356.727-3.707 1.988C10.541 4.63 9.205 3.91 8.184 3.91v.828c.768 0 1.908.612 3.117 1.729A17.52 17.52 0 0 0 9.77 8.317c-.839.09-1.633.227-2.36.409a11.192 11.192 0 0 1-.193-1.076c-.174-1.418.04-2.52.542-2.813a.826.826 0 0 1 .426-.096v-.828c-.311 0-.593.067-.838.208-1.043.601-1.277 2.475-.739 4.827-2.307.713-3.81 1.852-3.81 3.054 0 1.206 1.51 2.348 3.825 3.057-.534 2.36-.297 4.238.75 4.839.241.14.523.207.835.207 1.02 0 2.356-.727 3.706-1.988 1.35 1.254 2.687 1.973 3.707 1.973.312 0 .594-.066.839-.207 1.042-.601 1.276-2.475.738-4.827 2.3-.71 3.803-1.852 3.803-3.054zm-4.83-2.475a16.65 16.65 0 0 1-.502 1.466 20.13 20.13 0 0 0-1.02-1.759c.527.078 1.035.174 1.521.293zm-1.7 3.952c-.29.5-.587.975-.894 1.417a19.32 19.32 0 0 1-3.347.004 19.312 19.312 0 0 1-1.67-2.887 19.738 19.738 0 0 1 1.662-2.898 19.303 19.303 0 0 1 3.347-.004 19.31 19.31 0 0 1 1.67 2.887c-.234.497-.49.994-.768 1.48zm1.198-.483c.2.497.371.995.512 1.477a16.66 16.66 0 0 1-1.528.297 20.553 20.553 0 0 0 1.016-1.774zm-3.762 3.96c-.345-.357-.69-.754-1.032-1.188.334.015.676.026 1.02.026.35 0 .695-.008 1.032-.026a14.49 14.49 0 0 1-1.02 1.187zm-2.76-2.186a16.748 16.748 0 0 1-1.522-.293c.137-.479.308-.972.501-1.466.152.297.312.594.486.89.174.297.353.587.534.869zm2.741-7.722c.345.357.69.754 1.032 1.188a22.955 22.955 0 0 0-1.02-.026c-.35 0-.694.007-1.032.026.334-.434.679-.831 1.02-1.188zM9.142 9.234a20.483 20.483 0 0 0-1.017 1.77 15.9 15.9 0 0 1-.512-1.477c.486-.115.998-.215 1.529-.293zm-3.358 4.645c-1.314-.56-2.163-1.295-2.163-1.877 0-.583.85-1.321 2.163-1.878.319-.137.668-.26 1.028-.374.211.727.49 1.484.834 2.26a17.573 17.573 0 0 0-.823 2.248 11.261 11.261 0 0 1-1.04-.379zm1.996 5.303c-.505-.29-.724-1.392-.553-2.81.04-.348.108-.715.19-1.09a17.99 17.99 0 0 0 2.355.404c.501.687 1.02 1.31 1.544 1.855-1.21 1.125-2.345 1.74-3.117 1.74a.885.885 0 0 1-.42-.1zm8.801-2.828c.174 1.418-.04 2.52-.542 2.813a.826.826 0 0 1-.426.096c-.768 0-1.908-.612-3.117-1.729a17.53 17.53 0 0 0 1.532-1.851c.839-.09 1.633-.227 2.36-.409.085.375.152.735.193 1.08zm1.428-2.475c-.319.138-.667.26-1.027.375a17.83 17.83 0 0 0-.835-2.26c.341-.771.616-1.524.824-2.248.367.115.716.241 1.042.378 1.314.56 2.163 1.295 2.163 1.878-.003.582-.853 1.32-2.166 1.877z" />
                          <path d="M11.895 13.698a1.696 1.696 0 1 0 0-3.392 1.696 1.696 0 0 0 0 3.392z" />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2.797 1.629)"
                              d="M0 0h18.203v20.742H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      React.js
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2.88 3.062 6.067l1.364 11.818L12 22.08l7.575-4.195 1.363-11.818L12 2.88z"
                          fill="#DD0031"
                        />
                        <path
                          d="M12 2.88v2.131-.01V22.08l7.574-4.195 1.364-11.818L12 2.88z"
                          fill="#C3002F"
                        />
                        <path
                          d="M12 5.002 6.413 17.53h2.083l1.123-2.804h4.743l1.123 2.804h2.083L12 5.002zm1.632 7.996h-3.264L12 9.072l1.632 3.926z"
                          fill="#fff"
                        />
                      </svg>
                      Angular
                    </button>
                    <button
                      type="button"
                      onClick={(e) => switchClass(e)}
                      className={styles.technologie}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#a)">
                          <path
                            d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
                            fill="#512BD4"
                          />
                          <path
                            d="M5.565 14.778a.504.504 0 0 1-.36-.142.465.465 0 0 1-.15-.344.47.47 0 0 1 .15-.348.497.497 0 0 1 .36-.145c.144 0 .265.048.364.145a.464.464 0 0 1 .152.348.46.46 0 0 1-.152.344.508.508 0 0 1-.364.142zM11.218 14.698h-.92l-2.42-3.82a1.712 1.712 0 0 1-.153-.301h-.021c.019.11.028.349.028.714v3.407H6.92V9.5h.98l2.34 3.73c.099.155.162.261.19.319h.015a4.745 4.745 0 0 1-.036-.7V9.5h.81v5.198zM15.178 14.698H12.33V9.5h2.733v.732h-1.891v1.472h1.743v.728h-1.743v1.537h2.005v.729zM19.222 10.232h-1.456v4.466h-.842v-4.466h-1.453V9.5h3.751v.732z"
                            fill="#fff"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path
                              fill="#fff"
                              transform="translate(2 2)"
                              d="M0 0h20v20H0z"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      .NET
                    </button>
                  </div>
                </div>
                <div className={styles.form2} style={{ gap: "20px" }}>
                  <button className={styles.clear}>Wyczyść</button>
                  <button className={styles.searchButton}>Szukaj ofert</button>
                </div>
              </form>
            </div>
          </div>
          <div className={styles.div3}>3</div>
        </div>
      </main>
    </>
  );
};

export default MainPage;
