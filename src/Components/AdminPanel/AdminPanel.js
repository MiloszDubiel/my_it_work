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
  const [requests, setRequests] = useState([]);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState(null);
  const [pendingType, setPendingType] = useState(null); // "approve" | "reject"

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

  const loadRequests = () => {
    axios
      .get("http://localhost:5000/admin/company-change-requests", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => setRequests(res.data.requests));
  };

  useEffect(() => {
    loadRequests();
  }, []);

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

  const askApprove = (id) => {
    setPendingRequestId(id);
    setPendingType("approve");
    setMessage("Czy na pewno chcesz zaakceptować zmianę danych firmy?");
    setShowRequestConfirm(true);
  };

  const askReject = (id) => {
    setPendingRequestId(id);
    setPendingType("reject");
    setMessage("Czy na pewno chcesz odrzucić zmianę danych firmy?");
    setShowRequestConfirm(true);
  };

  const handleRequestConfirm = async (result) => {
    setShowRequestConfirm(false);

    if (!result) return;

    if (pendingType === "approve") {
      await approve(pendingRequestId);
    } else if (pendingType === "reject") {
      await reject(pendingRequestId);
    }

    setPendingRequestId(null);
    setPendingType(null);
  };

  const approve = async (id) => {
    await axios.post(
      "http://localhost:5000/admin/approve-company-change",
      { request_id: id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    loadRequests();
    loadCompanies();
  };

  const reject = async (id) => {
    await axios.post(
      "http://localhost:5000/admin/reject-company-change",
      { request_id: id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    loadRequests();
  };

  return (
    <div className={styles.adminContainer}>
      <Navbar />
      <div className={styles.layout}>
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
          {showRequestConfirm && (
            <ConfirmModal
              message={message}
              onConfirm={handleRequestConfirm}
              onCancel={handleRequestConfirm}
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
                <div className={styles.cards}>
                  {users.map((u) => (
                    <div key={u.id} className={styles.card}>
                      <div className={styles.cardRow}>
                        <span>Email</span>
                        <b>{u.email}</b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>Imię</span>
                        <b>
                          {u.name} {u.surname}
                        </b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>Typ</span>
                        <b>{u.role}</b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>Aktywny</span>
                        <b>{u.is_active === "1" ? "Tak" : "Nie"}</b>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => {
                            setSelectedUser(u);
                            setIsEditing(true);
                          }}
                        >
                          ✏️ Edytuj
                        </button>

                        {u.role !== "admin" && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => askDeleteUser(u.id)}
                          >
                            🗑 Usuń
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className={styles.cards}>
                  {companies.map((c) => (
                    <div key={c.id} className={styles.card}>
                      <div className={styles.cardRow}>
                        <span>Nazwa</span>
                        <b>{c.companyName}</b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>NIP</span>
                        <b>{c.nip}</b>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => {
                            setSelectedCompany(c);
                            setIsEditingCompany(true);
                          }}
                        >
                          ✏️ Edytuj
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => askDeleteCompany(c.id)}
                        >
                          🗑 Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

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
                <h3>Prośby o zmiane danych</h3>
                <div>
                  <h2>Prośby o zmianę danych firmy</h2>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Firma (stara → nowa)</th>
                        <th>NIP (stary → nowy)</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>

                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id}>
                          <td>
                            {r.old_name} → <b>{r.new_company_name}</b>
                          </td>
                          <td>
                            {r.old_nip} → <b>{r.new_nip}</b>
                          </td>
                          <td>
                            <button
                              className={styles.editBtn}
                              onClick={() => askApprove(r.id)}
                            >
                              ✔
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => askReject(r.id)}
                            >
                              ✖
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={styles.cards}>
                    {requests.map((r) => (
                      <div key={r.id} className={styles.card}>
                        <div className={styles.cardRow}>
                          <span>Firma</span>
                          <b>
                            {r.old_name} → {r.new_company_name}
                          </b>
                        </div>

                        <div className={styles.cardRow}>
                          <span>NIP</span>
                          <b>
                            {r.old_nip} → {r.new_nip}
                          </b>
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            className={styles.editBtn}
                            onClick={() => askApprove(r.id)}
                          >
                            ✔ Akceptuj
                          </button>

                          <button
                            className={styles.deleteBtn}
                            onClick={() => askReject(r.id)}
                          >
                            ✖ Odrzuć
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                <div className={styles.cards}>
                  {offers.map((o) => (
                    <div key={o.id} className={styles.card}>
                      <div className={styles.cardRow}>
                        <span>Stanowisko</span>
                        <b>{o.title}</b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>Firma</span>
                        <b>{o.companyName}</b>
                      </div>

                      <div className={styles.cardRow}>
                        <span>Status</span>
                        <b>{o.is_active === 1 ? "Aktywna" : "Nieaktywna"}</b>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => {
                            setSelectedOffer(o);
                            setIsEditingOffer(true);
                          }}
                        >
                          ✏️ Edytuj
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => askDeleteOffer(o.id)}
                        >
                          🗑 Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
