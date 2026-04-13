import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import file from "./data/StudentsPerformance.csv";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line,
  PieChart, Pie, Cell,
  Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(file, {
      download: true,
      header: true,
      complete: (result) => {
        const clean = result.data.filter(d => d["math score"]);
        setData(clean);
      }
    });
  }, []);

  const avg = (arr, key) =>
    (arr.reduce((sum, d) => sum + Number(d[key]), 0) / (arr.length || 1)).toFixed(1);

  const total = data.length;

  // BAR
  const genderData = ["male", "female"].map(g => {
    const f = data.filter(d => d.gender === g);
    return {
      gender: g,
      math: avg(f, "math score"),
      reading: avg(f, "reading score"),
      writing: avg(f, "writing score")
    };
  });

  // LINE
  const trendData = data.slice(0, 20).map((d, i) => ({
    index: i + 1,
    math: Number(d["math score"]),
    reading: Number(d["reading score"]),
    writing: Number(d["writing score"]),
  }));

  // PIE
  const lunchData = [
    { name: "Standard", value: data.filter(d => d.lunch === "standard").length },
    { name: "Free/Reduced", value: data.filter(d => d.lunch === "free/reduced").length }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>Student Performance Dashboard</h1>

        {/* KPI */}
        <div style={styles.kpi}>
          <Card title="Total Siswa" value={total} />
          <Card title="Math Avg" value={avg(data, "math score")} />
          <Card title="Reading Avg" value={avg(data, "reading score")} />
          <Card title="Writing Avg" value={avg(data, "writing score")} />
        </div>

        {/* CHART */}
        <div style={styles.grid}>

          <ChartCard title="Perbandingan Nilai Berdasarkan Gender">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="math" fill="#6D4C41" />
                <Bar dataKey="reading" fill="#D81B60" />
                <Bar dataKey="writing" fill="#F48FB1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Trend Nilai Siswa (20 Data)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="math" stroke="#6D4C41" />
                <Line type="monotone" dataKey="reading" stroke="#D81B60" />
                <Line type="monotone" dataKey="writing" stroke="#F48FB1" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribusi Lunch">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={lunchData} dataKey="value" outerRadius={80} label>
                  <Cell fill="#6D4C41" />
                  <Cell fill="#D81B60" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* TABLE */}
        <div style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>Data Siswa (Sample)</h3>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Gender</th>
                  <th>Math</th>
                  <th>Reading</th>
                  <th>Writing</th>
                </tr>
              </thead>

              <tbody>
                {data.slice(0, 10).map((d, i) => (
                  <tr
                    key={i}
                    style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F8BBD0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0 ? "#fff" : "#FCE4EC")
                    }
                  >
                    <td>{d.gender}</td>
                    <td>{d["math score"]}</td>
                    <td>{d["reading score"]}</td>
                    <td>{d["writing score"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALISIS */}
        <div style={styles.analysisSection}>
          <h3 style={styles.analysisTitle}>Analisis Data</h3>

          <div style={styles.analysisGrid}>

            <div style={styles.analysisCard}>
              <h4> Insight</h4>
              <ul>
                <li>Test preparation meningkatkan nilai siswa secara signifikan</li>
                <li>Reading & writing lebih tinggi dibanding matematika</li>
                <li>Lunch standard lebih dominan</li>
              </ul>
            </div>

            <div style={styles.analysisCard}>
              <h4> Tren</h4>
              <ul>
                <li>Nilai siswa relatif stabil pada reading & writing</li>
                <li>Matematika lebih fluktuatif</li>
                <li>Preparation memberi dampak positif konsisten</li>
              </ul>
            </div>

            <div style={styles.analysisCard}>
              <h4> Rekomendasi</h4>
              <ul>
                <li>Tingkatkan program test preparation</li>
                <li>Fokus pembelajaran matematika</li>
                <li>Dukung siswa dengan kondisi ekonomi rendah</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// COMPONENT
const Card = ({ title, value }) => (
  <div style={styles.card}>
    <div style={styles.cardTop}></div>
    <p style={styles.cardTitle}>{title}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={styles.chartCard}>
    <h3 style={styles.chartTitle}>{title}</h3>
    {children}
  </div>
);

// STYLE
const styles = {
  page: {
    background: "#F7F3F5",
    minHeight: "100vh",
    padding: "30px"
  },

  container: {
    maxWidth: "1200px",
    margin: "auto"
  },

  title: {
    textAlign: "center",
    color: "#4E342E",
    marginBottom: "30px",
    fontWeight: "600"
  },

  kpi: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    background: "linear-gradient(135deg, #fff, #FCE4EC)",
    padding: "20px",
    borderRadius: "14px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
  },

  cardTop: {
    height: "6px",
    background: "linear-gradient(90deg,#6D4C41,#D81B60)",
    borderRadius: "10px 10px 0 0",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%"
  },

  cardTitle: {
    color: "#6D4C41",
    marginTop: "10px"
  },

  cardValue: {
    color: "#D81B60",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px"
  },

  chartCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  chartTitle: {
    marginBottom: "10px",
    color: "#5D4037"
  },

  tableCard: {
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  tableWrapper: {
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #eee"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  tableHeader: {
    background: "#6D4C41",
    color: "#fff",
    textAlign: "center"
  },

  sectionTitle: {
    marginBottom: "10px"
  },

  rowEven: {
    background: "#fff",
    textAlign: "center"
  },

  rowOdd: {
    background: "#FCE4EC",
    textAlign: "center"
  },

  // ANALISIS
  analysisSection: {
    marginTop: "40px",
  },

  analysisTitle: {
    marginBottom: "15px",
    color: "#4E342E",
    fontWeight: "600",
  },

  analysisGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
    gap: "20px",
  },

  analysisCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    borderTop: "5px solid #D81B60",
  }
};

export default App;