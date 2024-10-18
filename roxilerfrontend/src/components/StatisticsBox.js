import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/statistics?month=${selectedMonth}`);
        setStatistics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth]); // Fetch statistics whenever the selected month changes

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Statistics for Month: {selectedMonth}</h2>
      <p>Total Sale Amount: ${statistics.totalSaleAmount.toFixed(2)}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
