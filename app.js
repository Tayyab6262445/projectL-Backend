const path = require("path");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const app = express();

const shipmentRoutes = require("./routes/shipmentRoutes");
const bulkShipment = require("./routes/bulkshipment");
const authRoutes = require("./routes/authRoutes");


connectDB();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
}, express.static(path.join(__dirname, 'uploads')));


app.use(cors({
    origin: 'http://localhost:5173', // Update this to your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); 
app.use("/api", shipmentRoutes);
app.use("/api", bulkShipment);
app.use("/api", authRoutes);




module.exports = app;
