const express = require('express');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;

// Path to the Next.js build output
const buildDir = path.join(__dirname, '../.next');
const publicDir = path.join(__dirname, '../public');

// Middleware to serve static files
app.use(express.static(publicDir));
// Check if .next directory exists before serving
try {
  if (fs.existsSync(buildDir)) {
    console.log(`Build directory exists at: ${buildDir}`);
    // Serve static assets from .next directory
    app.use('/_next', express.static(buildDir));
  } else {
    console.warn(`Build directory not found at: ${buildDir}`);
    console.warn('Static assets may not be served correctly. Run "npm run build" first.');
  }
} catch (error) {
  console.warn('Error setting up static file middleware:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Build information endpoint
app.get('/api/build-info', (req, res) => {
  try {
    const gitCommit = execSync('git rev-parse HEAD').toString().trim();
    const buildTime = new Date().toISOString();
    
    res.status(200).json({
      gitCommit,
      buildTime,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve build information' });
  }
});

// Simple test API endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'Test API is working',
    timestamp: new Date().toISOString()
  });
});

// Home route
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>Build Test Server</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 30px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          ul {
            margin-top: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          code {
            background: #f0f0f0;
            padding: 3px 6px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>CincinHotels Express Build Test Server</h1>
          <p>This is a test server for validating builds.</p>
          <p>Available endpoints:</p>
          <ul>
            <li><code>/api/health</code> - Health check endpoint</li>
            <li><code>/api/build-info</code> - Build information</li>
            <li><code>/api/test</code> - Test API endpoint</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Build test server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});