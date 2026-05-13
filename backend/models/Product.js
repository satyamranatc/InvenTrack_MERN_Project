const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: 'Pieces' },
    price: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, required: true, default: 0 },
    image: { type: String },
    description: { type: String },
    
    // Advanced Business Fields
    minStockThreshold: { type: Number, default: 10 },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    location: { type: String, default: 'Warehouse A' }, // Physical location tracking
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
