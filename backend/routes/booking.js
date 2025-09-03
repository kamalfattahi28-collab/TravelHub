// routes/booking.js
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

router.use(authMiddleware, authorizeRoles("tourist"));

  // create booking
router.post("/", async (req, res) => {
  const { tourist_id, tour_id, booking_date, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO bookings (tourist_id, tour_id, booking_date, status)
       VALUES (?, ?, ?, ?)`,
      [tourist_id, tour_id, booking_date, status]
    );

    asyncContext.logger.info(`Tourist ${req.user.id} created a booking`);
    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      data: { booking_id: result.insertId },
    });
  } catch (error) {
    asyncContext.logger.error("Error creating booking:", error);
    res.status(500).json({ status: "error", message: "Failed to create booking" });
  }
});

 // Get booking
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM bookings WHERE tourist_id = ?",
      [req.user.id]
    );

    res.json({
      status: "success",
      message: "Bookings fetched successfully",
      data: rows,
    });
  } catch (error) {
    asyncContext.logger.error("Error fetching bookings:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch bookings" });
  }
});

// put booking by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { booking_date, status } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE bookings 
       SET booking_date = ?, status = ?
       WHERE booking_id = ? AND tourist_id = ?`,
      [booking_date, status, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found or not authorized",
      });
    }

    res.json({
      status: "success",
      message: "Booking updated successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error updating booking:", error);
    res.status(500).json({ status: "error", message: "Failed to update booking" });
  }
});

// Delete booking by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM bookings WHERE booking_id = ? AND tourist_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found or not authorized",
      });
    }

    res.json({
      status: "success",
      message: "Booking deleted successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error deleting booking:", error);
    res.status(500).json({ status: "error", message: "Failed to delete booking" });
  }
});

module.exports = router;
