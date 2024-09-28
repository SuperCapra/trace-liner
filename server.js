const express = require('express');
const path = require('path');
// const axios = require('axios');
// const cors = require('cors');
const app = express();
const helmet = require('helmet');

const roots = [
  '/nama-crew',
  '/mura-sunset-ride',
  '/sem',
];

// // enables cors for all routea
// app.use(cors());

// // Route to handle image requests
// app.get('/image-proxy', async (req, res) => {
//   const imageUrl = req.query.url;
  
//   try {
//     // Fetch the image from the external service
//     const response = await axios.get(imageUrl, { responseType: 'stream' });
    
//     // Forward the image back to the client
//     res.setHeader('Content-Type', response.headers['content-type']);
//     response.data.pipe(res);
//   } catch (error) {
//     res.status(500).send('Error fetching image');
//   }
// });

// Use Helmet to set various security headers
app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://www.strava.com"],
        imgSrc: ["*"],
      }
    }
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', "web-share=(self)");
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match,
// send back the index.html from the React app.
roots.forEach(rootKey => {
  app.get(rootKey, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  let rootAdmin = '/admin' + rootKey
  app.get(rootAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
})

// app.get('/api/strava_webhook', (req, res) => {
//   res.json({ 'hub.mode': 'subscribe','hub.challenge': 'oN6G8xMkPNrJtTd3PRohCLXjJLHxLpymJJwWpDza','hub.verify_token': 'STRAVA_BEAUTYLINER'});
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});