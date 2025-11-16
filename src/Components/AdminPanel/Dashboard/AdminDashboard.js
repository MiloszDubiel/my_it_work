import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styles from "./AdminDashboard.module.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/stats", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <p>Ładowanie statystyk...</p>;

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard Analitczny</h2>

      {/* Trend użytkowników i ofert */}
      <div className={styles.chartContainer}>
        <h3>Nowi użytkownicy vs Nowe oferty</h3>
        <LineChart
          width={600}
          height={300}
          data={stats.users.map((u, i) => ({
            month: u.month,
            users: u.count,
            offers: stats.offers[i]?.count || 0,
          }))}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" />
          <Line type="monotone" dataKey="offers" stroke="#82ca9d" />
        </LineChart>
      </div>

      {/* Popularność firm */}
      <div className={styles.chartContainer}>
        <h3>Top 10 firm wg liczby ofert</h3>
        <BarChart
          width={600}
          height={300}
          data={stats.companies}
          margin={{ top: 20 }}
        >
          <XAxis dataKey="companyName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="offersCount" fill="#FF8042" />
        </BarChart>
      </div>

      {/* Kategorie ofert */}
      <div className={styles.chartContainer}>
        <h3>Kategorie ofert</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={stats.categories}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {stats.categories.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default AdminDashboard;
