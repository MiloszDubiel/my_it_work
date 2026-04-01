import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nip, setNIP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const validate = () => {
    if (!firstName) {
      return "Podaj imię";
    }
    if (!/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(firstName)) {
      return "Imię nie moze zawierać cyfr i znaków specjalnych oraz musi się zaczynać z wielkiej litery";
    }
    if (!lastName) {
      return "Podaj nazwisko";
    }
    if (
      !/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{2,}(-[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{2,})?$/.test(
        lastName,
      )
    ) {
      return "Nazwisko musi zawierac min. 2 litery oraz może zawierać znak '-'";
    }

    if (!email) return "Podaj adres e-mail";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Podaj poprawny email";
    }
    if (
      password.length < 8 ||
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]{8,}$/.test(
        password,
      )
    )
      return "Hasło musi mieć min. 8 znaków, 1 wielką literę, 1 cyfrę i 1 znak specjalny";
    if (password !== repeatPassword) return "Hasła są różne";
    if (role === "employer" && !companyName) return "Podaj nazwę firmy";
    if (role === "employer" && !nip) return "Podaj NIP";
    if (role === "employer" && !/^\d{10}$/.test(nip)) {
      return "Niepoprawny NIP";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      if (!role) {
        setError("Nie wybrano roli");
        return;
      }

      const payload = {
        email: email.trim().toLowerCase(),
        password,
        repeatPassword,
        role,
        firstName,
        lastName,
        ...(role === "employer" ? { companyName, nip } : {}),
      };

      const res = await axios.post(
        "http://localhost:5000/auth/registre",
        payload,
      );

      setInfo(res.data.info);

         setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (error) {
      console.log(error);
      e.target.parentElement.parentElement.scrollTo(0,0)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.container1}
        role="region"
        aria-label="Formularz rejestracji"
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Utwórz konto jako:</span>
           <select
  className={styles.input}
  value={role}
  onChange={(e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setCompanyName("");
    setNIP(null);
    setError("");
    setInfo("");
  }}
  required
>
  <option value="" disabled>
    -- Wybierz --
  </option>
  <option value="candidate">Kandydat</option>
  <option value="employer">Pracodawca</option>
</select>
          </label>

          <h2 className={styles.title}>Zarejestruj się</h2>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
          {info && (
            <div className={styles.info} role="alert">
              {info}
            </div>
          )}

          {role && (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Imię</span>
                <input
                  className={styles.input}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Imię"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Nazwisko</span>
                <input
                  className={styles.input}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nazwisko"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>E-mail</span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Hasło</span>
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Hasło"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Powtórz hasło</span>
                <input
                  className={styles.input}
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Powtórz hasło"
                  required
                />
              </label>
              {role === "employer" && (
                <>
                  <label className={styles.field}>
                    <span className={styles.label}>Nazwa firmy</span>
                    <input
                      className={styles.input}
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nazwa firmy"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>NIP</span>
                    <input
                      className={styles.input}
                      type="text"
                      value={nip}
                      onChange={(e) => setNIP(e.target.value)}
                      placeholder="NIP"
                      required
                      minLength={10}
                      maxLength={10}
                    />
                  </label>
                </>
              )}
            </>
          )}
          <button
            className={styles.btnPrimary}
            type="submit"
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : "Zarejestruj"}
          </button>

          <div className={styles.footer}>
            <span>Masz już konto?</span>{" "}
            <Link to="/login" className={styles.link}>
              Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
