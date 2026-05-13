const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Returned'], 
        default: 'Pending' 
    },
    totalAmount: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);
