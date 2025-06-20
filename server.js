const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const homeRoutes = require('./routes/index');

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the HTTPS Library Server');
});

// Read SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

// Use routes
app.use('/', homeRoutes);

// Determine port
const PORT = process.env.PORT || 4096;

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});
