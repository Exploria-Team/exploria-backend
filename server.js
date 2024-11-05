const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/api', (req, res) => {
    res.send("This is dummy API for bangkit");
});