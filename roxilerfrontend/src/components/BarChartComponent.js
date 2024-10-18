import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ selectedMonth }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    console.log("Selected Month:", selectedMonth);

    try {
      const response = await axios.get("http://localhost:3001/api/bar-chart", {
        params: { month: selectedMonth },
      });
      setData(response.data);
      console.log("Data State:", response.data);
    } catch (err) {
      console.error("Error fetching bar chart data:", err);
      setError("Failed to load data. Please try again.");
    }
  };

  return (
    <div>
      <h2>Price Range Distribution</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BarChartComponent;
