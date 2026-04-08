import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import file from "./data/StudentsPerformance.csv";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(file, {
      download: true,
      header: true,
      complete: (result) => {
        const clean = result.data.filter((d) => d["math score"]);
        setData(clean);
      },
    });
  }, []);

  const avg = (arr, key) =>
    (
      arr.reduce((sum, d) => sum + Number(d[key]), 0) / (arr.length || 1)
    ).toFixed(1);

  const total = data.length;
  const avgMath = avg(data, "math score");
  const avgReading = avg(data, "reading score");
  const avgWriting = avg(data, "writing score");

  // BAR
  const genderData = ["male", "female"].map((g) => {
    const f = data.filter((d) => d.gender === g);
    return {
      gender: g,
      math: avg(f, "math score"),
      reading: avg(f, "reading score"),
      writing: avg(f, "writing score"),
    };
  });

  // LINE
  const courseData = [
    {
      category: "No Prep",
      math: avg(
        data.filter((d) => d["test preparation course"] === "none"),
        "math score",
      ),
      reading: avg(
        data.filter((d) => d["test preparation course"] === "none"),
        "reading score",
      ),
      writing: avg(
        data.filter((d) => d["test preparation course"] === "none"),
        "writing score",
      ),
    },
    {
      category: "Completed",
      math: avg(
        data.filter((d) => d["test preparation course"] === "completed"),
        "math score",
      ),
      reading: avg(
        data.filter((d) => d["test preparation course"] === "completed"),
        "reading score",
      ),
      writing: avg(
        data.filter((d) => d["test preparation course"] === "completed"),
        "writing score",
      ),
    },
  ];

  // PIE
  const lunchData = [
    {
      name: "Standard",
      value: data.filter((d) => d.lunch === "standard").length,
    },
    {
      name: "Free/Reduced",
      value: data.filter((d) => d.lunch === "free/reduced").length,
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Students Performance in Exams Dashboard</h1>

      {/* KPI */}
      <div style={styles.kpi}>
        <Card title="Total Siswa" value={total} />
        <Card title="Rata-rata Math" value={avgMath} />
        <Card title="Rata-rata Reading" value={avgReading} />
        <Card title="Rata-rata Writing" value={avgWriting} />
      </div>

      {/* CHART */}
      <div style={styles.grid}>
        {/* BAR */}
        <div style={styles.chartCard}>
          <h3>Perbandingan Nilai Berdasarkan Gender</h3>
          <BarChart width={350} height={260} data={genderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="math" fill="#6D4C41" />
            <Bar dataKey="reading" fill="#D81B60" />
            <Bar dataKey="writing" fill="#F06292" />
          </BarChart>
        </div>

        {/* LINE */}
        <div style={styles.chartCard}>
          <h3>Pengaruh Test Preparation terhadap Nilai</h3>
          <LineChart width={350} height={260} data={courseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="math" stroke="#6D4C41" strokeWidth={2} />
            <Line dataKey="reading" stroke="#D81B60" strokeWidth={2} />
            <Line dataKey="writing" stroke="#F06292" strokeWidth={2} />
          </LineChart>
        </div>

        {/* PIE */}
        <div style={styles.chartCard}>
          <h3>Distribusi Jenis Lunch</h3>
          <PieChart width={350} height={260}>
            <Pie data={lunchData} dataKey="value" outerRadius={90} label>
              <Cell fill="#6D4C41" />
              <Cell fill="#D81B60" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* TABLE (UPGRADED) */}
      <div style={styles.tableCard}>
        <h3 style={{ marginBottom: "15px" }}>Data Siswa (Top 10 Sample)</h3>

        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Math</th>
              <th style={styles.th}>Reading</th>
              <th style={styles.th}>Writing</th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 10).map((d, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#FFF" : "#FDECEF",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8BBD0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? "#FFF" : "#FDECEF")
                }
              >
                <td style={styles.td}>{d.gender}</td>
                <td style={styles.td}>{d["math score"]}</td>
                <td style={styles.td}>{d["reading score"]}</td>
                <td style={styles.td}>{d["writing score"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INSIGHT */}
      <div style={styles.insight}>
        <h3>Insight Data</h3>
        <ul>
          <li>
            Siswa yang mengikuti test preparation memiliki nilai lebih tinggi di
            semua kategori.
          </li>
          <li>
            Nilai reading dan writing cenderung lebih tinggi dibanding
            matematika.
          </li>
          <li>
            Siswa dengan lunch standard lebih banyak dan cenderung memiliki
            performa lebih baik.
          </li>
          <li>
            Perbedaan gender tidak terlalu signifikan dibanding faktor lainnya.
          </li>
        </ul>
      </div>
    </div>
  );
}

// COMPONENT KPI
const Card = ({ title, value }) => (
  <div style={styles.card}>
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

// STYLE FINAL
const styles = {
  container: {
    padding: "30px",
    background: "#FDF6F8",
    fontFamily: "Segoe UI",
  },
  title: {
    textAlign: "center",
    color: "#6D4C41",
    marginBottom: "30px",
  },
  kpi: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    borderTop: "5px solid #D81B60",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px,1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  tableCard: {
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thRow: {
    background: "#6D4C41",
  },
  th: {
    color: "#fff",
    padding: "12px",
  },
  td: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
  },
  insight: {
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
};

export default App;
