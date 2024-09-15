const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');

// Use Helmet to set various security headers
app.use(helmet());

// Enforce Permissions-Policy header
app.use(
  helmet({
    permissionsPolicy: {
      features: {
        'web-share': ["'self'"], // Allow web-sharing
      },
    },
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match,
// send back the index.html from the React app.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/strava_webhook', (req, res) => {
  res.json({ 'hub.mode': 'subscribe','hub.challenge': 'oN6G8xMkPNrJtTd3PRohCLXjJLHxLpymJJwWpDza','hub.verify_token': 'STRAVA_BEAUTYLINER'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});