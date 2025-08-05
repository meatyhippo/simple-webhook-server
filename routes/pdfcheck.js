import express from 'express';
import isBase64 from 'is-base64';

const router = express.Router();

router.post('/checkbinary', (req, res) => {
    const { pdfData } = req.body;

    if (!pdfData || !isBase64(pdfData)) {
        return res.status(400).json({ error: 'Invalid PDF data' });
    }

    // Proceed with PDF processing
    res.status(200).json({ message: 'PDF is valid' });
});

export default router;