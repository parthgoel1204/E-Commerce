// backend/routes/cart.js
const express = require('express');
const auth = require('../middleware/auth');
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addItemToCart);
router.delete('/:itemId', auth, removeItemFromCart);

module.exports = router;