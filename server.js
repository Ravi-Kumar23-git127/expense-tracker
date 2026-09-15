const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();

const app = express();
app.use(cors());



// Middleware
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Expense routes
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Expense Tracker Server is running!");
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
           console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });