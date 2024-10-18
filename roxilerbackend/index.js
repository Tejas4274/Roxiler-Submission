import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

const url = "mongodb://localhost:27017";
const databaseName = "roxiler";
const client = new MongoClient(url);

let Db;

async function connectDB() {
  try {
    await client.connect();
    Db = client.db(databaseName);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}





const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// Endpoint to fetch paginated and searched transactions




async function getAllTransactions(searchQuery, page, perPage) {
  try {
    const collection = Db.collection("tabledata");

    let searchFilter = {};
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      searchFilter = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { price: parseFloat(searchQuery) || 0 }
        ]
      };
    }

    const skip = (page - 1) * perPage;

    const transactions = await collection.find(searchFilter)
      .skip(skip)
      .limit(perPage)
      .toArray();

    const totalRecords = await collection.countDocuments(searchFilter);

    return {
      transactions, // Ensure this is always an array
      totalRecords,
      currentPage: page,
      perPage
    };
  } catch (error) {
    console.error("Error fetching transactions from MongoDB:", error);
    return { transactions: [], totalRecords: 0, currentPage: page, perPage };
  }
}

app.get('/transactions', async (req, res) => {
  const { search, page = 1, perPage = 10 } = req.query;

  // Convert page and perPage to integers
  const pageNum = parseInt(page, 10);
  const itemsPerPage = parseInt(perPage, 10);

  if (isNaN(pageNum) || isNaN(itemsPerPage) || pageNum < 1 || itemsPerPage < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  try {
    // Fetch transactions from the database or service
    const allTransactions = await getAllTransactions(search, pageNum, itemsPerPage);

    // Return the paginated response
    res.json({
      transactions: allTransactions.transactions,
      totalRecords: allTransactions.totalRecords,
      page: allTransactions.currentPage,
      perPage: allTransactions.perPage,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;

  // Ensure the month is a valid number between 1 and 12
  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Month parameter is required and must be between 1 and 12' });
  }

  try {
    console.log("Requested Month:", month); // Log the requested month

    const collection = Db.collection("tabledata");

    // Define price ranges
    const ranges = [
      { label: '0-100', min: 0, max: 100 },
      { label: '101-200', min: 101, max: 200 },
      { label: '201-300', min: 201, max: 300 },
      { label: '301-400', min: 301, max: 400 },
      { label: '401-500', min: 401, max: 500 },
      { label: '501-600', min: 501, max: 600 },
      { label: '601-700', min: 601, max: 700 },
      { label: '701-800', min: 701, max: 800 },
      { label: '801-900', min: 801, max: 900 },
      { label: '901-above', min: 901 }
    ];

    const data = await Promise.all(ranges.map(async (range) => {
      const count = await collection.countDocuments({
        price: { $gte: range.min, $lt: range.max },
        dateOfSale: {
          $regex: new RegExp(`-0*${month.toString().padStart(2, '0')}-`), // Match month in dateOfSale
        },
      });

      console.log(`Query for range ${range.label}: price >= ${range.min} && price < ${range.max} && month matches ${month}`);
      console.log(`Count for ${range.label}:`, count); // Log the count for each range
      return { range: range.label, count };
    }));

    console.log("Response Data:", data); // Log the response data
    res.json(data);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});


const isValidMonth = (month) => {
  const parsedMonth = parseInt(month, 10);
  return parsedMonth >= 1 && parsedMonth <= 12;
};








// Endpoint to fetch total sale amount, total sold, and unsold items
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  if (!isValidMonth(month)) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  try {
    const collection = Db.collection('tabledata');

    // Define the month filter
    const monthFilter = {
      dateOfSale: {
        $regex: new RegExp(`-0*${month.toString().padStart(2, '0')}-`),
      },
    };

    // Total Sale Amount
    const totalSaleAmount = await collection
      .aggregate([
        { $match: { ...monthFilter, sold: true } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ])
      .toArray();

    // Total Sold Items
    const totalSoldItems = await collection.countDocuments({
      ...monthFilter,
      sold: true,
    });

    // Total Not Sold Items
    const totalNotSoldItems = await collection.countDocuments({
      ...monthFilter,
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});



// Start the server and connect to MongoDB
app.listen(3001, async () => {
  console.log("App is running on port 3001");
  await connectDB(); // Connect to MongoDB when the server starts
});
