import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'online',
        message: 'Webhook server is running',
        timestamp: new Date().toISOString(),
        flags: req.passedArgs || {}
    });
});

// Export the router
export default router;