import { useState, useEffect } from "react";
import styles from "./UserEditModal.module.css";
import axios from "axios";

const UserEditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    is_active: "",
  });

  const [errors, setErrors] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        surname: user.surname,
        email: user.email,
        is_active: user.is_active,
      });
    }
  }, [user]);

  const validate = () => {
    if (user.role != "employer" && (!form.name || form.name.length < 2)) {
      setErrors("Imię musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (user.role != "employer" && (!form.surname || form.surname.length < 2)) {
      setErrors("Nazwisko musi mieć co najmniej 2 znaki.");
      return false;
    }

    if (!form.email) {
      setErrors("Email jest wymagany.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors("Niepoprawny format email.");
      return false;
    }

    if (form.is_active !== "1" && form.is_active !== "0") {
      setErrors("Wybierz poprawną opcję.");
      return false;
    }
    return true;
  };
  console.log(form);

  const handleChange = (e) => {
    setErrors("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    if (!validate()) return;

    setErrors("");

    axios
      .put(`http://localhost:5000/admin/users/${user.id}`, form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then(() => {
        onSave();
        onClose();
      })
      .catch((err) => console.log(err));
  };

  if (!user) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <h2>Edytuj użytkownika</h2>
        <p className={styles.error}>{errors}</p>

        {user.role != "employer" && (
          <>
            <label>Imię</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
            />

            <label>Nazwisko</label>
            <input
              name="surname"
              value={form.surname}
              onChange={handleChange}
              type="text"
            />
          </>
        )}

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />
        {user.role !== "admin" && (
          <>
            <label>Aktywny</label>
            <select
              name="is_active"
              value={form.is_active}
              onChange={handleChange}
            >
              <option value="1">Tak</option>
              <option value="0">Nie</option>
            </select>
          </>
        )}
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Anuluj
          </button>

          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={errors.length > 0 ? true : false}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
