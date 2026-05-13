const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/products
// @desc    Create a product
router.post('/', upload.single('image'), async (req, res) => {
    const { name, category, stock, unit, price, costPrice, description, minStockThreshold, batchNumber, expiryDate, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
        name,
        category,
        stock: Number(stock) || 0,
        unit,
        price,
        costPrice: Number(costPrice) || 0,
        image,
        description,
        minStockThreshold: Number(minStockThreshold) || 10,
        batchNumber,
        expiryDate,
        location
    });

    try {
        const savedProduct = await newProduct.save();
        
        // Log initial stock
        if (savedProduct.stock > 0) {
            await new AuditLog({
                product: savedProduct._id,
                productName: savedProduct.name,
                type: 'Inbound',
                quantityChange: savedProduct.stock,
                newStock: savedProduct.stock,
                reason: 'Initial stock entry'
            }).save();
        }

        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PATCH /api/products/:id
// @desc    Update a product
router.patch('/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, category, stock, unit, price, costPrice, description, minStockThreshold, batchNumber, expiryDate, location } = req.body;
        const oldStock = product.stock;

        if (name) product.name = name;
        if (category) product.category = category;
        if (stock !== undefined) product.stock = Number(stock);
        if (unit) product.unit = unit;
        if (price) product.price = price;
        if (costPrice) product.costPrice = Number(costPrice);
        if (description) product.description = description;
        if (minStockThreshold) product.minStockThreshold = Number(minStockThreshold);
        if (batchNumber) product.batchNumber = batchNumber;
        if (expiryDate) product.expiryDate = expiryDate;
        if (location) product.location = location;
        if (req.file) product.image = `/uploads/${req.file.filename}`;

        const updatedProduct = await product.save();

        // Log adjustment if stock changed
        if (stock !== undefined && Number(stock) !== oldStock) {
            await new AuditLog({
                product: updatedProduct._id,
                productName: updatedProduct.name,
                type: 'Adjustment',
                quantityChange: Number(stock) - oldStock,
                newStock: updatedProduct.stock,
                reason: 'Manual adjustment'
            }).save();
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
