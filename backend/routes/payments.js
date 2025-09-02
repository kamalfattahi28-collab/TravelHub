// routes/payments.js
const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const asyncContext = require("../middleware/asyncContext");
const authMiddleware = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'magellansaudi'
});

router.use(authMiddleware);

//create payments only tourists
router.post("/", authorizeRoles("tourist"), async (req, res) => {
  const { booking_id, amount, method, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO payments (booking_id, amount, method, status, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [booking_id, amount, method, status]
    );

    asyncContext.logger.info(`Tourist ${req.user.id} made a payment`);
    res.status(201).json({
      status: "success",
      message: "Payment created successfully",
      data: { payment_id: result.insertId },
    });
  } catch (error) {
    asyncContext.logger.error("Error creating payment:", error);
    res.status(500).json({ status: "error", message: "Failed to create payment" });
  }
});


router.get("/", authorizeRoles("admin", "super_admin"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM payments ORDER BY created_at DESC");

    res.json({
      status: "success",
      message: "Payments fetched successfully",
      data: rows,
    });
  } catch (error) {
    asyncContext.logger.error("Error fetching payments:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch payments" });
  }
});


router.put("/:id", authorizeRoles("admin", "super_admin"), async (req, res) => {
  const { id } = req.params;
  const { amount, method, status } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE payments 
       SET amount = ?, method = ?, status = ?
       WHERE payment_id = ?`,
      [amount, method, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Payment not found" });
    }

    res.json({
      status: "success",
      message: "Payment updated successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error updating payment:", error);
    res.status(500).json({ status: "error", message: "Failed to update payment" });
  }
});

router.delete("/:id", authorizeRoles("admin", "super_admin"), async (req, res) => {
  const { id } = req.params;
  try {
      const [result] = await db.query("DELETE FROM payments WHERE payment_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Payment not found" });
    }

    res.json({
      status: "success",
      message: "Payment deleted successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error deleting payment:", error);
    res.status(500).json({ status: "error", message: "Failed to delete payment" });
  }
});

module.exports = router;
