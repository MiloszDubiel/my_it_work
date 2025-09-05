import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
const fetchUsers = async () => {
  try {
    let response = await axios.get("http://localhost:3001/admin/get-users");

    return response;
  } catch (e) {
    console.log(e);
  }
};

const AdminPanel = ({ users, jobOffers, companies }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [user, setUser] = useState([]);
  const [editedUser, setEditedUser] = useState([]);

  useEffect(() => {
    fetchUsers().then((res) => {
      setUser(res.data[0]);
    });
  }, []);

  return (
    <div className={styles.panel}>
      <h2>Panel administratora</h2>

      <div className={styles.showEditMenu} id="showMenu">
        {" "}
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.close}>
              <IoMdClose
                onClick={() => {
                  document.querySelector(`#showMenu`).style.display = "none";
                }}
              />
            </div>
            <h2>Edytuj użytkownika</h2>
            <form className={styles.form}>
              <label>
                Imię
                <input
                  type="text"
                  name="firstName"
                  value={editedUser[0].name}
                />
              </label>

              <label>
                Nazwisko
                <input
                  type="text"
                  name="lastName"
                  value={editedUser[0].surname}
                />
              </label>

              <label>
                Email
                <input type="email" name="email" value={editedUser[0].email} />
              </label>

              <label>
                Telefon
                <input
                  type="text"
                  name="phone"
                  value={editedUser[0].phone_number}
                />
              </label>

              <label>
                Rola
                <select name="role">
                  <option value="Candidate">Candidate</option>
                  <option value="Employer">Employer</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>

              <label>
                Odblokuj edycja hasła
                <input type="checkbox" name="unlock" />
              </label>
              <label>
                Hasło
                <input type="password" name="password" />
              </label>

              <label>
                Powtórz Hasło
                <input type="password" name="repeat-password" />
              </label>

              <div className={styles.actions}>
                <button type="button" className={styles.cancel}>
                  Anuluj
                </button>
                <button type="submit" className={styles.save}>
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Zakładki */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          Użytkownicy
        </button>
        <button
          className={activeTab === "jobOffers" ? styles.active : ""}
          onClick={() => setActiveTab("jobOffers")}
        >
          Oferty pracy
        </button>
        <button
          className={activeTab === "companies" ? styles.active : ""}
          onClick={() => setActiveTab("companies")}
        >
          Firmy
        </button>
      </div>

      {/* Sekcje */}
      <div className={styles.content}>
        {activeTab === "users" && (
          <div>
            <h3>Lista użytkowników</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Rola</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {user?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{u.surname}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className={styles.danger}
                        onClick={() => {
                          if (window.confirm("Czy usunąć użytkownika?")) {
                            axios.post(
                              "http://localhost:3001/admin/delete-users",
                              {
                                id: u.id,
                                email: u.email,
                              }
                            );
                          }

                          setUser(user.filter((el) => el.id != u.id));
                        }}
                      >
                        Usuń
                      </button>
                      <button
                        className={styles.primary}
                        onClick={() => {
                          document.querySelector(`#showMenu`).style.display =
                            "flex";

                          setEditedUser(
                            user.filter(
                              (el) => el.id == u.id && el.email == u.email
                            )
                          );
                        }}
                      >
                        Edytuj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "jobOffers" && (
          <div>
            <h3>Oferty pracy</h3>

            <h4>Oczekujące na akceptację</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stanowisko</th>
                  <th>Firma</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers
                  ?.filter((o) => o.status === "pending")
                  .map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.title}</td>
                      <td>{o.company}</td>
                      <td>{o.location}</td>
                      <td>
                        <button className={styles.primary}>Akceptuj</button>
                        <button className={styles.danger}>Odrzuć</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <h4>Dostępne</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stanowisko</th>
                  <th>Firma</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers
                  ?.filter((o) => o.status === "active")
                  .map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.title}</td>
                      <td>{o.company}</td>
                      <td>{o.location}</td>
                      <td>
                        <button className={styles.danger}>Usuń</button>
                        <button className={styles.primary}>Edytuj</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "companies" && (
          <div>
            <h3>Firmy</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nazwa</th>
                  <th>Technologie</th>
                  <th>Lokalizacja</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {companies?.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.technologies?.join(", ")}</td>
                    <td>{c.location}</td>
                    <td>
                      <button className={styles.danger}>Usuń</button>
                      <button className={styles.primary}>Edytuj</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
