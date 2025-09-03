// routes/ratings_comments.js
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

// create comment 
router.post("/", async (req, res) => {
  const { tourist_id, guide_id, tour_id, rating, comment } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ status: "fail", message: "Rating must be 1-5" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO ratings_comments (tourist_id, guide_id, tour_id, rating, comment, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [tourist_id, guide_id, tour_id, rating, comment]
    );

    asyncContext.logger.info(`Rating added by user ${req.user.id}`);
    res.status(201).json({
      status: "success",
      message: "Rating/comment created",
      data: { comment_id: result.insertId },
    });
  } catch (error) {
    asyncContext.logger.error("Error creating rating/comment:", error);
    res.status(500).json({ status: "error", message: "Failed to create rating/comment" });
  }
});

//get all comments
router.get("/", async (req, res) => {
  const { tour_id, guide_id } = req.query;

  let sql = "SELECT * FROM ratings_comments";
  const params = [];

  if (tour_id) {
    sql += " WHERE tour_id = ?";
    params.push(tour_id);
  } else if (guide_id) {
    sql += " WHERE guide_id = ?";
    params.push(guide_id);
  }

  sql += " ORDER BY created_at DESC";

  try {
    const [rows] = await db.query(sql, params);
    res.json({ status: "success", data: rows });
  } catch (error) {
    asyncContext.logger.error("Error fetching ratings/comments:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch ratings/comments" });
  }
});

//delete comment 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM ratings_comments WHERE comment_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "fail", message: "Rating/comment not found" });
    }

    asyncContext.logger.info(`Rating/comment ${id} deleted by super_admin`);
    res.json({ status: "success", message: "Rating/comment deleted successfully" });
  } catch (error) {
    asyncContext.logger.error("Error deleting rating/comment:", error);
    res.status(500).json({ status: "error", message: "Failed to delete rating/comment" });
  }
});

module.exports = router;
