const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for Grok integration (optional)
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, category } = req.body;
        
        // Here you can add your Grok API integration
        // For now, we'll return a placeholder response
        res.json({
            success: true,
            content: `Generated ${category} content: ${prompt}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate content'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Comedy Hub API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎭 Comedy Hub is running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to the URL above`);
    console.log(`🔧 Press Ctrl+C to stop the server`);
});

module.exports = app;
