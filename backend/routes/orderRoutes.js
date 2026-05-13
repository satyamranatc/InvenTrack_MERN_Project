const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/orders
router.post('/', async (req, res) => {
    const { customerName, productName, quantity, status } = req.body;

    try {
        // Find product to check and update stock
        const product = await Product.findOne({ name: productName });
        
        const order = new Order({
            customerName,
            productName,
            quantity,
            status
        });

        const newOrder = await order.save();

        if (product) {
            const oldStock = product.stock;
            product.stock -= Number(quantity);
            await product.save();

            // Create Audit Log
            await new AuditLog({
                product: product._id,
                productName: product.name,
                type: 'Outbound',
                quantityChange: -Number(quantity),
                newStock: product.stock,
                reason: `Order placed by ${customerName}`
            }).save();
        }

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update order status
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (req.body.status) order.status = req.body.status;
        if (req.body.customerName) order.customerName = req.body.customerName;
        if (req.body.productName) order.productName = req.body.productName;
        if (req.body.quantity) order.quantity = req.body.quantity;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
