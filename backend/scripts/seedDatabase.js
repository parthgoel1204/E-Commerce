// backend/scripts/seedDatabase.js
const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

const sampleProducts = [
  {
    title: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 99.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1612858249937-1cc0852093dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Smart Watch',
    description: 'Advanced fitness tracking and notifications',
    price: 299.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 149.99,
    category: 'home',
    image: 'https://plus.unsplash.com/premium_photo-1661722983090-11783531c332?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Running Shoes',
    description: 'Comfortable running shoes for daily training',
    price: 129.99,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1585944672394-4c58a015c1fb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Backpack',
    description: 'Durable backpack for everyday use',
    price: 79.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Desk Lamp',
    description: 'Adjustable LED desk lamp',
    price: 59.99,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with excellent sound quality',
    price: 89.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Gaming Mouse',
    description: 'High-precision gaming mouse with RGB lighting',
    price: 69.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample products
    await Item.insertMany(sampleProducts);
    console.log('Sample products added to database');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
