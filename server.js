require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');





// Connect DB
connectDB(process.env.MONGO_URI);

// ✅ MIDDLEWARE - Proper order
app.use(cors());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));