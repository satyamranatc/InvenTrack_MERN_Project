const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String }, // Denormalized for quick view
    type: { type: String, enum: ['Inbound', 'Outbound', 'Adjustment'], required: true },
    quantityChange: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String }, // e.g. "Order #123", "Manual Audit", "Expiry Disposal"
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
