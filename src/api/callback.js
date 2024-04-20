const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Example endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});