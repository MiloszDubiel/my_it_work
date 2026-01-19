import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
const AdminDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("user-data"));

  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats/offers")
      .then((res) => setOffers(res.data));

    axios
      .get(`http://localhost:5000/api/stats/applications/${user.id}`)
      .then((res) => setApplications(res.data));

    axios
      .get(`http://localhost:5000/api/stats/user/${user.id}/skills`)
      .then((res) => setUserData(res.data));
  }, []);

  const parseSalary = (salary) => {
    if (!salary) return 0;

    return (() => {
      const cleaned = salary
        .replace(/\u00A0/g, " ")
        .replace(/pln/gi, "")
        .replace(/[–—]/g, "-");
      const numbers = cleaned.match(/\d{1,3}(?:[ ]\d{3})*/g);
      if (!numbers) return 0;

      const parsed = numbers.map((n) => Number(n.replace(/\s/g, "")));

      if (parsed.length >= 2) {
        return Math.round((parsed[0] + parsed[1]) / 2);
      }

      return parsed[0];
    })();
  };

  const salaryData = offers.map((o, index) => ({
    id: index,
    salary: parseSalary(o.salary),
  }));

  const salaries = offers
    .map((o) => {
      if (!o.salary) return null;
      const [min, max] = o.salary.split(/-|–/).map(Number);
      return (min + max) / 2;
    })
    .filter(Boolean);

  const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length || 0;

  const medianSalary =
    [...salaries].sort((a, b) => a - b)[Math.floor(salaries.length / 2)] || 0;

  const accepted = applications.filter(
    (a) => a.status === "zaakceptowana"
  ).length;
  const successRate = applications.length
    ? Math.round((accepted / applications.length) * 100)
    : 0;

  const simulatedRate = Math.min(100, successRate + boost);

  const matchScore = (offer) => {
    if (!userData) return 0;
    const offerTech = JSON.parse(offer.technologies || "[]");
    const userTech = JSON.parse(userData.skills || "[]");

    const techMatch =
      userTech.filter((t) => offerTech.includes(t)).length / offerTech.length ||
      0;

    return Math.round(techMatch * 100);
  };

  return (
    <div className={styles.dashboard}>
      <h1>📊 Statystyki użytkownika</h1>

      <section className={styles.card}>
        <h2>💰 Wynagrodzenia</h2>
        <p>
          Średnia: <strong>{avgSalary.toFixed(0)} PLN</strong>
        </p>
        <p>
          Mediana: <strong>{medianSalary.toFixed(0)} PLN</strong>
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salaryData}>
            <XAxis dataKey="id" hide />
            <YAxis />
            <Tooltip formatter={(v) => `${v} PLN`} />
            <Bar dataKey="salary" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.card}>
        <h2>📈 Skuteczność aplikacji</h2>
        <p>
          Aktualna: <strong>{successRate}%</strong>
        </p>

        <input
          type="range"
          min="0"
          max="20"
          value={boost}
          onChange={(e) => setBoost(Number(e.target.value))}
        />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            width={400}
            height={200}
            data={[
              { name: "Teraz", value: successRate },
              { name: "Po poprawie parametrów", value: simulatedRate },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#16a34a" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.card}>
        <h2>🤝 Dopasowanie do ofert</h2>

        {offers.slice(0, 5).map((o) => {
          const score = matchScore(o);
          return (
            <div key={o.id} className={styles.matchRow}>
              <span>{o.title}</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${score}%` }} />
              </div>
              <strong>{score}%</strong>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AdminDashboard;
