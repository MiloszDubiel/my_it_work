import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";
import UserEditModal from "./User/UserEditModal";
import CompanyEditModal from "./Company/CompanyEditModal";
import OfferEditModal from "./Offers/OfferEditModal";
import axios from "axios";
import Navbar from "../NavBar/NavBar";
import AdminDashboard from "./Dashboard/AdminDashboard";
import AdminSettings from "./AdminSettings/AdminSettings";
import ConfirmModal from "../PromptModals/ConfirmModal";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("analise");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingComapny, setIsEditingCompany] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageComapny, setPageCompany] = useState(1);
  const [pageOffers, setPageOffers] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "companies") loadCompanies();
    if (activeTab === "offers") loadOffers();
  }, [
    activeTab,
    isEditing,
    isEditingComapny,
    isEditingOffer,
    page,
    pageComapny,
    pageOffers,
    search,
  ]);

  const loadUsers = () => {
    axios
      .get(
        `http://localhost:5000/admin/get-users?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const loadCompanies = () => {
    axios
      .get(
        `http://localhost:5000/admin/get-companies?page=${pageComapny}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setCompanies(res.data.companies);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const loadOffers = () => {
    axios
      .get(
        `http://localhost:5000/admin/get-offers?page=${pageOffers}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setOffers(res.data.offers);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const deleteUser = (id) => {
    axios
      .post(
        "http://localhost:5000/admin/delete-user",
        { id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(() => loadUsers())
      .catch((err) => console.error(err));
  };

  const deleteCompany = (id) => {
    axios
      .post(
        "http://localhost:5000/admin/delete-company",
        { id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(() => loadCompanies())
      .catch((err) => console.error(err));
  };

  const deleteOffer = (id) => {
    axios
      .post(
        "http://localhost:5000/admin/delete-offer",
        { id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then(() => loadOffers())
      .catch((err) => console.error(err));
  };

  const handleConfirm = (result) => {
    setShowConfirm(false);

    if (result && confirmAction) {
      confirmAction();
    }

    setConfirmAction(null);
  };

  const askDeleteUser = (id) => {
    setMessage("Czy na pewno chcesz usunąć użytkownika?");
    setConfirmAction(() => () => deleteUser(id));
    setShowConfirm(true);
  };
  const askDeleteCompany = (id) => {
    setMessage("Czy na pewno chcesz usunąć firmę?");
    setConfirmAction(() => () => deleteCompany(id));
    setShowConfirm(true);
  };
  const askDeleteOffer = (id) => {
    setMessage("Czy na pewno chcesz usunąć ofertę pracy?");
    setConfirmAction(() => () => deleteOffer(id));
    setShowConfirm(true);
  };
  return (
    <div className={styles.adminContainer}>
      <Navbar />
      <div style={{ display: "flex", height: "calc(100% - 80px)" }}>
        <aside className={styles.sidebar}>
          <h2>Panel Administratora</h2>
          <ul>
            <li
              className={activeTab === "analise" ? styles.active : ""}
              onClick={() => setActiveTab("analise")}
            >
              📊 Analiza
            </li>
            <li
              className={activeTab === "users" ? styles.active : ""}
              onClick={() => setActiveTab("users")}
            >
              👤 Użytkownicy
            </li>
            <li
              className={activeTab === "companies" ? styles.active : ""}
              onClick={() => setActiveTab("companies")}
            >
              🏢 Firmy
            </li>
            <li
              className={activeTab === "offers" ? styles.active : ""}
              onClick={() => setActiveTab("offers")}
            >
              💼 Oferty pracy
            </li>
            <li
              className={activeTab === "settings" ? styles.active : ""}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Ustawienia
            </li>
          </ul>
        </aside>

        <main className={styles.content}>
          {showConfirm && (
            <ConfirmModal
              message={message}
              onConfirm={handleConfirm}
              onCancel={handleConfirm}
            />
          )}

          {activeTab === "analise" && (
            <section className={styles.section}>
              <AdminDashboard />
            </section>
          )}
          {activeTab === "users" && (
            <section className={styles.section}>
              {isEditing && (
                <UserEditModal
                  user={selectedUser}
                  onClose={() => setIsEditing(false)}
                  onSave={() => setIsEditing(false)}
                />
              )}
              <input
                type="text"
                placeholder="Szukaj po email / imieniu"
                className={styles.searchInput}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />

              <h3>Lista użytkowników</h3>
              <div className={styles.table}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Imię</th>
                      <th>Typ</th>
                      <th>Aktywny</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>
                          {u.name} {u.surname}
                        </td>
                        <td>{u.role}</td>
                        <td>{u.is_active === "1" ? "Tak" : "Nie"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className={styles.editBtn}
                              onClick={() => {
                                setSelectedUser(u);
                                setIsEditing(true);
                              }}
                            >
                              ✏️
                            </button>

                            {u.role !== "admin" && (
                              <button
                                className={styles.deleteBtn}
                                onClick={() => askDeleteUser(u.id)}
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ◀ Poprzednia
                  </button>

                  <span>
                    Strona {page} z {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Następna ▶
                  </button>
                </div>
              </div>
            </section>
          )}
          {/* --- FIRMY --- */}
          {activeTab === "companies" && (
            <section className={styles.section}>
              <h3>Firmy</h3>
              {isEditingComapny && (
                <CompanyEditModal
                  company={selectedCompany}
                  onClose={() => setIsEditingCompany(false)}
                  onSave={() => setIsEditingCompany(false)}
                />
              )}
              <input
                type="text"
                placeholder="Szukaj po nazwie firmy"
                className={styles.searchInput}
                value={search}
                onChange={(e) => {
                  setPageCompany(1);
                  setSearch(e.target.value);
                }}
              />

              <div className={styles.table}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nazwa</th>
                      <th>NIP</th>

                      <th>Akcje</th>
                    </tr>
                  </thead>

                  <tbody>
                    {companies.map((c) => (
                      <tr key={c.id}>
                        <td>{c.companyName}</td>
                        <td>{c.nip}</td>
                        <td>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className={styles.editBtn}
                              onClick={() => {
                                setSelectedCompany(c);
                                setIsEditingCompany(true);
                              }}
                            >
                              ✏️
                            </button>

                            <button
                              className={styles.deleteBtn}
                              onClick={() => askDeleteCompany(c.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.pagination}>
                  <button
                    disabled={pageComapny === 1}
                    onClick={() => setPageCompany((p) => p - 1)}
                  >
                    ◀ Poprzednia
                  </button>

                  <span>
                    Strona {pageComapny} z {totalPages}
                  </span>

                  <button
                    disabled={pageComapny === totalPages}
                    onClick={() => setPageCompany((p) => p + 1)}
                  >
                    Następna ▶
                  </button>
                </div>
              </div>
            </section>
          )}
          {/* --- OFERTY PRACY --- */}
          {activeTab === "offers" && (
            <section className={styles.section}>
              <h3>Oferty pracy</h3>
              {isEditingOffer && (
                <OfferEditModal
                  offer={selectedOffer}
                  onClose={() => setIsEditingOffer(false)}
                  onSave={() => setIsEditingOffer(false)}
                />
              )}
              <input
                type="text"
                placeholder="Szukaj po stanowisku"
                className={styles.searchInput}
                value={search}
                onChange={(e) => {
                  setPageOffers(1);
                  setSearch(e.target.value);
                }}
              />

              <div className={styles.table}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Stanowisko</th>
                      <th>Firma</th>
                      <th>Data</th>
                      <th>Aktywna</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>

                  <tbody>
                    {offers.map((o) => (
                      <tr key={o.id}>
                        <td>{o.title}</td>
                        <td>{o.companyName}</td>
                        <td>
                          {!o.updated_at
                            ? ""
                            : new Date(o.updated_at).toLocaleDateString(
                                "pl-PL"
                              )}
                        </td>
                        <td>{o.is_active == "1" ? "Tak" : "Nie"}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              className={styles.editBtn}
                              onClick={() => {
                                setSelectedOffer(o);
                                setIsEditingOffer(true);
                              }}
                            >
                              ✏️
                            </button>

                            <button
                              className={styles.deleteBtn}
                              onClick={() => askDeleteOffer(o.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.pagination}>
                <button
                  disabled={pageOffers === 1}
                  onClick={() => setPageOffers((p) => p - 1)}
                >
                  ◀ Poprzednia
                </button>

                <span>
                  Strona {pageOffers} z {totalPages}
                </span>

                <button
                  disabled={pageOffers === totalPages}
                  onClick={() => setPageOffers((p) => p + 1)}
                >
                  Następna ▶
                </button>
              </div>
            </section>
          )}
          {activeTab === "settings" && (
            <section className={styles.section}>
              <AdminSettings />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
