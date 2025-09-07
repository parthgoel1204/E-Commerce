// backend/controllers/cartController.js
const Cart = require('../models/Cart');
const Item = require('../models/Item');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.itemId');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to get cart' });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    let { itemId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }
    
    // Check if item exists in database, if not create it (for sample products)
    let item;
    try {
      item = await Item.findById(itemId);
    } catch (error) {
      item = null;
    }
    
    if (!item) {
      const sampleProducts = {
        '1': { title: 'Wireless Headphones', description: 'Premium wireless headphones with noise cancellation', price: 99.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1612858249937-1cc0852093dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        '2': { title: 'Smart Watch', description: 'Advanced fitness tracking and notifications', price: 299.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        '3': { title: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe', price: 149.99, category: 'home', image: 'https://plus.unsplash.com/premium_photo-1661722983090-11783531c332?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        '4': { title: 'Running Shoes', description: 'Comfortable running shoes for daily training', price: 129.99, category: 'sports', image: 'https://images.unsplash.com/photo-1585944672394-4c58a015c1fb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        '5': { title: 'Backpack', description: 'Durable backpack for everyday use', price: 79.99, category: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        '6': { title: 'Desk Lamp', description: 'Adjustable LED desk lamp', price: 59.99, category: 'home', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      };
      
      if (sampleProducts[itemId]) {
        item = new Item({
          ...sampleProducts[itemId]
        });
        await item.save();
        
        itemId = item._id.toString();
      } else {
        return res.status(404).json({ message: 'Item not found' });
      }
    }
    
    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);
    
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId: itemId, quantity: quantity });
    }
    
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.itemId');
    res.json(populatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === req.params.itemId);
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.itemId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};