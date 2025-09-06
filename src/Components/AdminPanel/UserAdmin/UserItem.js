import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import styles from "../AdminPanel.module.css";
import { IoMdClose } from "react-icons/io";

const EditUser = ({ listOfUsers, selectedUser, forceUpdate }) => {
  const [user, setUser] = useState([]);
  const [editedUser, setEditedUser] = useState([]);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setID] = useState(null);

  useEffect(() => {
    setName(selectedUser[0]?.name);
    setSurname(selectedUser[0]?.surname);
    setEmail(selectedUser[0]?.email);
    setPhone(selectedUser[0]?.phone_number);
    setRole(selectedUser[0]?.role);
    setID(selectedUser[0]?.id);
  }, [selectedUser]);

  const hadleSubmit = (e) => {
    const name = document.querySelector("#name").value.trim();
    const surname = document.querySelector("#surname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const role = document.querySelector("#role").value;
    const checkbox = document.querySelector("#unlock");

    let password = null;
    let repeat = null;
    if (!name || !surname || !email || !phone || !role) {
      alert("Wszystkie pola muszą być wypełnione!");
      return;
    }
    if (!/^\d{9}$/.test(phone)) {
      alert("Telefon musi składać się z dokładnie 9 cyfr!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Podaj poprawny adres email!");
      return;
    }

    if (checkbox.checked) {
      password = document.querySelector("#password").value.trim();
      repeat = document.querySelector("#repeat-password").value.trim();

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

      if (!passwordRegex.test(password)) {
        alert(
          "Hasło musi mieć min. 8 znaków, jedną wielką literę, jedną cyfrę i znak specjalny!"
        );
        return;
      }

      if (password !== repeat) {
        alert("Hasła muszą się zgadzać!");
        return;
      }
    }

    const userData = {
      id: id,
      name,
      surname,
      email,
      phone,
      role,
      password: checkbox.checked ? password : null,
    };

    try {
      axios.post("http://localhost:3001/admin/edit-user", userData);
    } catch (e) {
      console.log(e);
    }
    alert("Zapisano");
    forceUpdate();
    document.querySelector(`#showMenu`).style.display = "none";
  };

  return (
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
                value={name}
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>

            <label>
              Nazwisko
              <input
                type="text"
                name="lastName"
                value={surname}
                id="surname"
                onChange={(e) => {
                  setSurname(e.target.value);
                }}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>

            <label>
              Telefon
              <input
                type="text"
                name="phone"
                value={phone}
                id="phone"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </label>

            <label>
              Rola
              <select
                name="role"
                id="role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value="Candidate">Candidate</option>
                <option value="Employer">Employer</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label style={{ flexDirection: "row", alignItems: "center" }}>
              <input
                type="checkbox"
                name="unlock"
                id="unlock"
                className={styles.unlock}
                onChange={(e) => {
                  let password = document.querySelector("#password");
                  let repeat = document.querySelector("#repeat-password");
                  let isDisabled = password.disabled;
                  password.disabled = !isDisabled;
                  repeat.disabled = !isDisabled;
                }}
              />
              Odblokuj edycja hasła
            </label>
            <label>
              Hasło
              <input type="password" name="password" id="password" disabled />
            </label>

            <label>
              Powtórz Hasło
              <input
                type="password"
                name="repeat-password"
                id="repeat-password"
                disabled
              />
            </label>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => {
                  document.querySelector(`#showMenu`).style.display = "none";
                }}
              >
                Anuluj
              </button>
              <button
                type="button"
                className={styles.save}
                onClick={(e) => hadleSubmit(e)}
              >
                Zapisz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const UserItem = ({ listOfUsers, forceUpdate }) => {
  const [selectUser, setSelectedUser] = useState([""]);

  return (
    <>
      <EditUser
        listOfUsers={listOfUsers}
        selectedUser={selectUser}
        forceUpdate={forceUpdate}
      />
      {listOfUsers &&
        listOfUsers[0].map((u, index) => {
          return (
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
                      axios.post("http://localhost:3001/admin/delete-users", {
                        id: u.id,
                        email: u.email,
                      });
                    }
                    forceUpdate();
                  }}
                >
                  Usuń
                </button>
                <button
                  className={styles.primary}
                  onClick={() => {
                    document.querySelector(`#showMenu`).style.display = "flex";

                    const selected = listOfUsers[0].filter(
                      (el) => el.id == u.id && el.email == u.email
                    );
                    setSelectedUser(selected);
                  }}
                >
                  Edytuj
                </button>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export default UserItem;
