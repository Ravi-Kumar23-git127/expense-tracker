const express = require("express");

const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =================================
// ADD EXPENSE
// =================================

router.post("/", authMiddleware, async (req, res) => {
    try {

        const { title, amount, category } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const expense = await Expense.create({
            title,
            amount,
            category,
            userId: req.userId
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =================================
// GET MY EXPENSES
// =================================

router.get("/", authMiddleware, async (req, res) => {
    try {

        const expenses = await Expense.find({
            userId: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            expenses
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =================================
// DELETE EXPENSE
// =================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        await Expense.deleteOne({
            _id: req.params.id
        });

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;