// routes/tours.js
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
// get all tours
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().execute("SELECT * FROM tours ORDER BY tour_date DESC");
    console.log("Fetched all tours");
    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch tours" });
  }
});

// get tours by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().execute("SELECT * FROM tours WHERE tour_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ status: "fail", message: "Tour not found" });

    console.log(`Fetched tour ID ${id}`);
    res.json({ status: "success", data: rows[0] });
  } catch (error) {
    console.error(`Error fetching tour ID ${id}:`, error);
    res.status(500).json({ status: "error", message: "Failed to fetch tour" });
  }
});


router.use(authMiddleware, authorizeRoles("admin", "guide"));

//create tour
router.post("/", async (req, res) => {
  const { title, location, price, duration, time, tour_date, status = "available" } = req.body;
  const guides_id = req.user.guides_id || null; 

  const validStatus = ["available", "full", "cancelled"];
  if (!validStatus.includes(status)) return res.status(400).json({ status: "fail", message: "Invalid status" });

  try {
    const [result] = await db.promise().execute(
      `INSERT INTO tours (guides_id, title, location, price, duration, time, tour_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [guides_id, title, location, price, duration, time, tour_date, status]
    );

    asyncContext.logger.info(`Tour created by user ${req.user.id}`);
    res.status(201).json({ status: "success", tour_id: result.insertId, title, location, price, duration, time, tour_date, status });
  } catch (error) {
    asyncContext.logger.error("Error creating tour:", error);
    res.status(500).json({ status: "error", message: "Failed to create tour" });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, location, price, duration, time, tour_date, status } = req.body;

  const validStatus = ["available", "full", "cancelled"];
  if (status && !validStatus.includes(status)) return res.status(400).json({ status: "fail", message: "Invalid status" });

  try {
    const [result] = await db.promise().execute(
      `UPDATE tours SET title=?, location=?, price=?, duration=?, time=?, tour_date=?, status=? WHERE tour_id=?`,
      [title, location, price, duration, time, tour_date, status, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ status: "fail", message: "Tour not found" });

    asyncContext.logger.info(`Tour ID ${id} updated by user ${req.user.id}`);
    res.json({ status: "success", message: "Tour updated successfully" });
  } catch (error) {
    asyncContext.logger.error(`Error updating tour ID ${id}:`, error);
    res.status(500).json({ status: "error", message: "Failed to update tour" });
  }
});


router.delete("/:id", authMiddleware, authorizeRoles("super_admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().execute("DELETE FROM tours WHERE tour_id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ status: "fail", message: "Tour not found" });

    asyncContext.logger.info(`Tour ID ${id} deleted by super_admin`);
    res.json({ status: "success", message: "Tour deleted successfully" });
  } catch (error) {
    asyncContext.logger.error(`Error deleting tour ID ${id}:`, error);
    res.status(500).json({ status: "error", message: "Failed to delete tour" });
  }
});

module.exports = router;
