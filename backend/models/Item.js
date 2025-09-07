// backend/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: 'default-image-url' }
});

module.exports = mongoose.model('Item', itemSchema);