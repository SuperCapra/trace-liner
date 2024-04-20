const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Example endpoint
app.get('/api/strava_webhook', (req, res) => {
    res.json({ 'hub.mode': 'subscribe','hub.challenge': 'oN6G8xMkPNrJtTd3PRohCLXjJLHxLpymJJwWpDza','hub.verify_token': 'STRAVA_BEAUTYLINER'});
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});