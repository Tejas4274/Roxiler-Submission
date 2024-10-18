import React, { useEffect, useState } from "react";
import axios from "axios";
import './TransactionsTable.css'; // Import your CSS file here

function TransactionsTable({ selectedMonth }) {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("3"); // Default to March
  const [error, setError] = useState(null); // State for error handling

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:3001/transactions", {
        params: {
          search: searchQuery,
          page,
          perPage: 10,
        },
      });
      setTransactions(response.data.transactions);
      setError(null); 
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again."); // Set error message
    }
  };
  
  // The useEffect to fetch transactions based on searchQuery and page
  useEffect(() => {
    fetchTransactions();
  }, [searchQuery, page, selectedMonth]); // Adjust if needed
  

  return (
    <div className="table-container">
      <h2>Transactions</h2>
      <input
        type="text"
        placeholder="Search transactions"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>${transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
              <td>
                <img src={transaction.image} alt={transaction.title} style={{ width: '50px', height: '50px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(Math.max(page - 1, 1))}>
        Previous Page
      </button>
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}

export default TransactionsTable;

