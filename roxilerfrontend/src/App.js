import React, { useState } from "react";
import axios from "axios";
import StatisticsBox from "./components/StatisticsBox";
import BarChartComponent from "./components/BarChartComponent";
import TransactionsTable from "./components/TransactionsTable";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [searchText, setSearchText] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container">
      <h1>Transactions Dashboard</h1>

      <div>
        <label>Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <TransactionsTable
        selectedMonth={selectedMonth}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <StatisticsBox selectedMonth={selectedMonth} />

      <BarChartComponent selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
