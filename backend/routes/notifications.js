// routes/notifications.js
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

//allow only admin and superadmin
router.use(authMiddleware, authorizeRoles("super_admin", "admin"));

// create new notfication
router.post("/", async (req, res) => {
  const { user_id, message, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO notifications (user_id, message, status, created_at)
       VALUES (?, ?, ?, NOW())`,
      [user_id, message, status]
    );

    asyncContext.logger.info(`Notification created by ${req.user.role}`);
    res.status(201).json({
      status: "success",
      message: "Notification created successfully",
      data: { notification_id: result.insertId },
    });
  } catch (error) {
    asyncContext.logger.error("Error creating notification:", error);
    res.status(500).json({ status: "error", message: "Failed to create notification" });
  }
});

//get all notfication
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM notifications ORDER BY created_at DESC");

    res.json({
      status: "success",
      message: "Notifications fetched successfully",
      data: rows,
    });
  } catch (error) {
    asyncContext.logger.error("Error fetching notifications:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch notifications" });
  }
});
 // put notfication
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { message, status } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE notifications 
       SET message = ?, status = ? 
       WHERE notification_id = ?`,
      [message, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Notification not found" });
    }

    res.json({
      status: "success",
      message: "Notification updated successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error updating notification:", error);
    res.status(500).json({ status: "error", message: "Failed to update notification" });
  }
});
//delete notfication
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const [result] = await db.query(
      "DELETE FROM notifications WHERE notification_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Notification not found" });
    }

    res.json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    asyncContext.logger.error("Error deleting notification:", error);
    res.status(500).json({ status: "error", message: "Failed to delete notification" });
  }
});

module.exports = router;
