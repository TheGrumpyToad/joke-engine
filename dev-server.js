const express = require('express');
const path = require('path');
const { handler } = require('./netlify/functions/generate.js');

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the out directory (after build)
app.use(express.static(path.join(__dirname, 'out')));

// Handle Netlify function calls
app.post('/.netlify/functions/generate', async (req, res) => {
  try {
    const event = {
      body: JSON.stringify(req.body),
      headers: {
        'content-type': 'application/json'
      }
    };
    
    const result = await handler(event, {});
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Handle all other routes - serve the main app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Development server running on http://localhost:${PORT}`);
  console.log('This server handles Netlify function calls for development');
});
