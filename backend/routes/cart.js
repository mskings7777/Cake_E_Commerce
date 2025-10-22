const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    res.json(cart || { userId: req.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { cakeId, name, price, quantity, image } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.cakeId === cakeId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ cakeId, name, price, quantity, image });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:cakeId', auth, async (req, res) => {
  try {
    const { cakeId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.cakeId === parseInt(cakeId));

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.cakeId !== parseInt(cakeId));
    } else {
      item.quantity = quantity;
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/remove/:cakeId', auth, async (req, res) => {
  try {
    const { cakeId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.cakeId !== parseInt(cakeId));
    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
