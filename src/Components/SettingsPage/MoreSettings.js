import { useState, useRef } from "react";
import styles from "./moreSettings.module.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const TABS = ["Profil i hasło", "Zdjęcie", "Ulubione"];

export default function MoreSettings() {
  const [active, setActive] = useState(TABS[0]);

  const userData = JSON.parse(sessionStorage.getItem("user-data"));

  // Profil
  const [profile, setProfile] = useState({
    email: userData.email,
    name: "",
    surname: "",
    phone_number: "",
    newPassword: "",
    repeatPassword: "",
    id: userData.id,
    role: userData.role,
  });

  const [error, setError] = useState(["error", "none"]);
  const [info, setInfo] = useState(["info", "none"]);

  const sendForm = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.surname || !profile.email) {
      setError(["Niektóre pola nie zostały wypełnione", "block"]);
      return;
    }

    if (!document.querySelector("#password").disabled) {
      axios
        .post("http://localhost:5000/user/edit-profile", {
          profile,
        })
        .then((res) => {
          if (res.data.error) {
            return setError([res.data.error, "block"]);
          }
          sessionStorage.setItem(
            "user-data",
            JSON.stringify(res.data.userData)
          );

          setInfo([res.data.info, "block"]);
        });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className={styles.container} id="settings">
      <div className={styles.wrap}>
        <div className={styles.close}>
          <IoMdClose
            onClick={() => {
              document.querySelector(`#settings`).style.display = "none";
              document.querySelector("#root").style.overflow = "auto";
            }}
          />
        </div>
        <div className={styles.main}>
          <aside className={styles.sidebar}>
            <h2 className={styles.title}>Ustawienia</h2>
            <ul className={styles.tabs}>
              {TABS.map((t) => (
                <li key={t}>
                  <button
                    className={`${styles.tabBtn} ${
                      active === t ? styles.active : ""
                    }`}
                    onClick={() => setActive(t)}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className={styles.panel}>
            {active === "Profil i hasło" && (
              <section className={styles.card}>
                {error && (
                  <div
                    className={styles.error}
                    style={{ display: error[1] }}
                    role="alert"
                    onClick={() => {
                      setError([, "none"]);
                    }}
                  >
                    {error[0]}
                  </div>
                )}
                {info && (
                  <div
                    className={styles.info}
                    role="alert"
                    style={{ display: info[1] }}
                    onClick={() => {
                      setInfo([, "none"]);
                    }}
                  >
                    {info[0]}
                  </div>
                )}
                <h3>Profil użytkownika</h3>
                <form className={styles.form} onSubmit={sendForm}>
                  <div className={styles.row}>
                    <label>Imię</label>
                    <input
                      type="text"
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder={userData.name || "Nie podano"}
                    />
                  </div>
                  <div className={styles.row}>
                    <label>Nazwisko</label>
                    <input
                      type="text"
                      id="surname"
                      value={profile.surname}
                      onChange={(e) =>
                        setProfile({ ...profile, surname: e.target.value })
                      }
                      placeholder={userData.surname || "Nie podano"}
                    />
                  </div>
                  <div className={styles.row}>
                    <label>Email</label>
                    <input
                      type="text"
                      value={profile.email}
                      id="email"
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder={userData.email}
                    />
                  </div>
                  <div className={styles.row}>
                    <label>Numer telefonu</label>
                    <input
                      type="text"
                      value={profile.phone_number}
                      id="phone_number"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phone_number: e.target.value,
                        })
                      }
                      placeholder={userData.phone_number || "Nie podano"}
                    />
                  </div>
                  <hr />
                  <div className={styles.row}>
                    <button
                      className={styles.unlock}
                      type="button"
                      id="password"
                      onClick={(e) => {
                        let isUnlocked = document.querySelectorAll(
                          "input[type=password]"
                        )[0].disabled;

                        isUnlocked
                          ? (e.target.textContent = "Zablokuj pola")
                          : (e.target.textContent = "Odblokuj pola");

                        document
                          .querySelectorAll("input[type=password]")
                          .forEach((el) => {
                            el.disabled = !isUnlocked;
                            el.classList.toggle(styles.disabled);
                          });
                      }}
                    >
                      Odblokuj pola
                    </button>
                  </div>
                  <div className={styles.row}>
                    <label>Nowe hasło</label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      className={styles.disabled}
                      value={profile.newPassword}
                      onChange={(e) =>
                        setProfile({ ...profile, newPassword: e.target.value })
                      }
                      minLength={8}
                      disabled
                    />
                  </div>
                  <div className={styles.row}>
                    <label>Powtórz nowe hasło</label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      className={styles.disabled}
                      value={profile.repeatPassword}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          repeatPassword: e.target.value,
                        })
                      }
                      minLength={8}
                      disabled
                    />
                  </div>
                  <div className={styles.actions}>
                    <button type="submit" className={styles.primary}>
                      Zapisz
                    </button>
                  </div>
                </form>
              </section>
            )}

            {active === "Hasło" && (
              <section className={styles.card}>
                <h3>Zmień hasło</h3>
                <form className={styles.form} onSubmit={""}>
                  <div className={styles.actions}>
                    <button type="submit" className={styles.primary}>
                      Zmień hasło
                    </button>
                  </div>
                </form>
              </section>
            )}

            {active === "E-mail i login" && (
              <section className={styles.card}>
                <h3>E-mail i login</h3>
                <form className={styles.form} onSubmit={"submitEmailLogin"}>
                  <div className={styles.row}>
                    <label>E-mail</label>
                    <input
                      type="email"
                      // value={contact.email}
                      // onChange={(e) =>
                      //   setContact({ ...contact, email: e.target.value })
                      // }
                      placeholder="twoj@email.pl"
                      required
                    />
                  </div>
                  <div className={styles.row}>
                    <label>Login</label>
                    <input
                      type="text"
                      // value={contact.login}
                      // onChange={(e) =>
                      //   setContact({ ...contact, login: e.target.value })
                      // }
                      placeholder="Login"
                    />
                  </div>
                  <div className={styles.actions}>
                    <button type="submit" className={styles.primary}>
                      Zapisz
                    </button>
                  </div>
                </form>
              </section>
            )}

            {active === "Zdjęcie" && (
              <section className={styles.card}>
                <h3>Zdjęcie profilowe</h3>
                <div className={styles.avatarBlock}>
                  <div className={styles.avatar}>
                    {/* {avatarUrl ? (
                  // <img src={avatarUrl} alt="Avatar" />
                ) : (
                  <div className={styles.avatarPlaceholder}>Brak zdjęcia</div>
                )} */}
                  </div>
                  <div className={styles.avatarActions}>
                    <input
                      // ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      // onChange={onPickAvatar}
                      style={{ display: "none" }}
                    />
                    <button
                      className={styles.secondary}
                      // onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      Wybierz plik
                    </button>
                    <button
                      className={styles.primary}
                      // onClick={uploadAvatar}
                      type="button"
                      // disabled={!avatarFile}
                    >
                      Zapisz zdjęcie
                    </button>
                  </div>
                </div>
              </section>
            )}

            {active === "Ulubione" && (
              <section className={styles.card}>
                <h3>Zarządzanie ulubionymi</h3>
                {/* {favorites.length === 0 ? (
              <p>Nie masz jeszcze żadnych ulubionych pozycji.</p>
            ) : (
              <ul className={styles.favList}>
                {favorites.map((f) => (
                  <li key={f.id} className={styles.favItem}>
                    <span className={styles.favTitle}>{f.title}</span>
                    <button
                      className={styles.danger}
                      onClick={() => removeFavorite(f.id)}
                      type="button"
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            )} */}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
