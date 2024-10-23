const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require("path");
const app = express();
var cors = require('cors');
require('dotenv').config()

// CORS
app.use(cors());

// MAP FILES FROM DIRECTORY
app.use(express.static(path.join(__dirname, "build")));


// CALLBACK
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", req.originalUrl));
});

// FALLBACK
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(80)