import mongoose from 'mongoose';

// Updated schema to match the provided input format
const salesSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date, // Using Date type for easier filtering and querying by date
});

const Sales = mongoose.model('Sales', salesSchema);

export default Sales;

