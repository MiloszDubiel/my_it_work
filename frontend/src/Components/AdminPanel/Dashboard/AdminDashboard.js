import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [salaryStats, setSalaryStats] = useState(null);
  const [techStats, setTechStats] = useState([]);
  const [expStats, setExpStats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats/salary-stats")
      .then((res) => setSalaryStats(res.data));

    axios
      .get("http://localhost:5000/api/stats/tech-frequency")
      .then((res) => setTechStats(res.data.slice(0, 10)));

    axios
      .get("http://localhost:5000/api/stats/experience-vs-salary")
      .then((res) => setExpStats(res.data));
  }, []);

  if (!salaryStats) return null;

  return (
    <div className={styles.grid}>
      {/* 1) Salary stats */}
      <section className={styles.card}>
        <h2>💰 Statystyka wynagrodzeń</h2>
        <p>
          Średnia: <b>{salaryStats.avg.toFixed(0)} PLN</b>
        </p>
        <p>
          Mediana: <b>{salaryStats.median.toFixed(0)} PLN</b>
        </p>
        <p>
          Min: <b>{salaryStats.min.toFixed(0)} PLN</b>
        </p>
        <p>
          Max: <b>{salaryStats.max.toFixed(0)} PLN</b>
        </p>

        <LineChart
          width={400}
          height={200}
          data={salaryStats.raw.map((v, i) => ({ i, v }))}
        >
          <XAxis dataKey="i" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="v" stroke="#2563eb" />
        </LineChart>
      </section>

      {/* 2) Tech frequency */}
      <section className={styles.card}>
        <h2>Technologie</h2>

        <BarChart width={400} height={250} data={techStats}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </section>

      {/* 3) Experience vs salary */}
      <section className={styles.card}>
        <h2>Doświadczenie vs wynagrodzenie</h2>

        <BarChart width={400} height={250} data={expStats}>
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg_salary" fill="#16a34a" />
        </BarChart>

        {expStats.map((e) => (
          <p key={e.level}>
            {e.level}: {e.avg_salary?.toFixed(0)} PLN ({e.offers} ofert)
          </p>
        ))}
      </section>
    </div>
  );
}
