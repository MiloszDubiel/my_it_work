import { useState, useRef } from "react";
import styles from "./moreSettings.module.css";

const TABS = ["Profil", "Hasło", "E-mail i login", "Zdjęcie", "Ulubione"];

export default function MoreSettings({
  initialUser = {
    login: "jdoe",
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    avatarUrl: "",
    favorites: [
      { id: "fav-1", title: "Frontend Developer @ ACME" },
      { id: "fav-2", title: "Node.js Engineer @ Globex" },
    ],
  },
  onSaveProfile, // async (data) => {}
  onChangePassword, // async ({oldPassword,newPassword}) => {}
  onChangeEmailLogin, // async ({email,login}) => {}
  onUploadAvatar, // async (file) => returns url
  onRemoveFavorite, // async (id) => {}
}) {
  const [active, setActive] = useState(TABS[0]);

  // Profil
  const [profile, setProfile] = useState({
    login: initialUser.login,
    firstName: initialUser.firstName,
    lastName: initialUser.lastName,
  });

  // E-mail i login
  const [contact, setContact] = useState({
    email: initialUser.email,
    login: initialUser.login,
  });

  // Hasło
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNew: "",
  });

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  // Ulubione
  const [favorites, setFavorites] = useState(initialUser.favorites || []);

  const submitProfile = async (e) => {
    e.preventDefault();
    if (!profile.firstName.trim() || !profile.lastName.trim()) return;
    await onSaveProfile?.(profile);
  };

  const submitEmailLogin = async (e) => {
    e.preventDefault();
    if (!contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    await onChangeEmailLogin?.(contact);
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) return;
    if (passwords.newPassword !== passwords.confirmNew) return;
    await onChangePassword?.({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    });
    setPasswords({ oldPassword: "", newPassword: "", confirmNew: "" });
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const uploadedUrl = await onUploadAvatar?.(avatarFile);
    if (uploadedUrl) setAvatarUrl(uploadedUrl);
  };

  const removeFavorite = async (id) => {
    await onRemoveFavorite?.(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={styles.wrap}>
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
        {active === "Profil" && (
          <section className={styles.card}>
            <h3>Profil użytkownika</h3>
            <form className={styles.form} onSubmit={submitProfile}>
              <div className={styles.row}>
                <label>Imię</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  placeholder="Imię"
                  required
                />
              </div>
              <div className={styles.row}>
                <label>Nazwisko</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  placeholder="Nazwisko"
                  required
                />
              </div>
              <div className={styles.row}>
                <label>Login</label>
                <input
                  type="text"
                  value={profile.login}
                  onChange={(e) =>
                    setProfile({ ...profile, login: e.target.value })
                  }
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

        {active === "Hasło" && (
          <section className={styles.card}>
            <h3>Zmień hasło</h3>
            <form className={styles.form} onSubmit={submitPassword}>
              <div className={styles.row}>
                <label>Obecne hasło</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.row}>
                <label>Nowe hasło</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  minLength={8}
                  placeholder="Min. 8 znaków"
                  required
                />
              </div>
              <div className={styles.row}>
                <label>Powtórz nowe hasło</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirmNew}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmNew: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>
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
            <form className={styles.form} onSubmit={submitEmailLogin}>
              <div className={styles.row}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  placeholder="twoj@email.pl"
                  required
                />
              </div>
              <div className={styles.row}>
                <label>Login</label>
                <input
                  type="text"
                  value={contact.login}
                  onChange={(e) =>
                    setContact({ ...contact, login: e.target.value })
                  }
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" />
                ) : (
                  <div className={styles.avatarPlaceholder}>Brak zdjęcia</div>
                )}
              </div>
              <div className={styles.avatarActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickAvatar}
                  style={{ display: "none" }}
                />
                <button
                  className={styles.secondary}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Wybierz plik
                </button>
                <button
                  className={styles.primary}
                  onClick={uploadAvatar}
                  type="button"
                  disabled={!avatarFile}
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
            {favorites.length === 0 ? (
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
            )}
          </section>
        )}
      </main>
    </div>
  );
}
