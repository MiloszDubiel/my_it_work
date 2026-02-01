import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [salaryStats, setSalaryStats] = useState(null);
  const [techStats, setTechStats] = useState([]);
  const [expStats, setExpStats] = useState([]);
  const [data, setData] = useState([]);

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

    axios
      .get("http://localhost:5000/api/stats/salary-histogram")
      .then((res) => setData(res.data.histogram))
      .catch((err) => console.error(err));
  }, []);

  if (!salaryStats) return null;

  return (
    <div className={styles.grid}>
      {/* 1) Histogram wynagrodzeń */}
      <section className={styles.card}>
        <h2>Rozkład wynagrodzeń (PLN)</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.map((d) => ({
                Zakres: d.range,
                LiczbaOfert: d.count,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <XAxis
                dataKey="Zakres"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "LiczbaOfert" ? "Liczba ofert" : name,
                ]}
              />
              <Bar dataKey="LiczbaOfert" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 2) Technologie */}
      <section className={styles.card}>
        <h2>Technologie</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={techStats.map((t) => ({
                Technologia: t.name,
                LiczbaOfert: t.count,
              }))}
              margin={{ bottom: 80, left: 20, right: 20 }}
            >
              <XAxis
                dataKey="Technologia"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "LiczbaOfert" ? "Liczba ofert" : name,
                ]}
              />
              <Bar dataKey="LiczbaOfert" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3) Doświadczenie vs wynagrodzenie */}
      <section className={styles.card}>
        <h2>Doświadczenie vs wynagrodzenie</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={expStats.map((e) => ({
                Poziom: e.level,
                ŚredniaPLN: e.avg_salary.toFixed(2),
              }))}
              margin={{ bottom: 80, left: 20, right: 20 }}
            >
              <XAxis
                dataKey="Poziom"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "ŚredniaPLN" ? "Średnia wynagrodzeń" : name,
                ]}
              />
              <Bar dataKey="ŚredniaPLN" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {expStats.map((e) => (
          <p key={e.level}>
            {e.level}: {e.avg_salary?.toFixed(0)} PLN ({e.offers} ofert)
          </p>
        ))}
      </section>
    </div>
  );
}
