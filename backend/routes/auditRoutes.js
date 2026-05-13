const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

// @route   GET /api/audit-logs
// @desc    Get all stock movement logs
router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
