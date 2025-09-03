const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { getContext } = require('../middleware/asyncContext');
const logger = require('../utils/logger');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'magellansaudi'
});

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

//  AllowAnonymous: Login admin
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.execute('SELECT * FROM admins WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Email not found');

        const user = result[0];
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) return res.status(500).send(err);
            if (!isMatch) return res.status(401).send('Wrong password');

            const token = jwt.sign(
                { admin_id: user.admin_id, email: user.email, role: user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.json({ message: "login success", token });
        });
    });
});

// 🟢 Protected Routes
router.use(authMiddleware);

// Create admin (🟢 admin + super_admin)
router.post('/', authorizeRoles("admin", "super_admin"), (req, res) => {
    const { name, email, password, phone, role } = req.body;

  
    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    const ctx = getContext(); // who is the user?
   // if admin dosenot create a superadin
    if (ctx.user.role === "admin" && role === "super_admin") {
        return res.status(403).send("Admins cannot create super_admin users");
    }

    
    if (!['super_admin','admin'].includes(role)) {
        return res.status(400).send('Invalid role');
    }

    db.execute('SELECT email FROM admins WHERE email=?', [email], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) return res.status(409).send('Email already exists');

        bcrypt.hash(password, 10, (err, password_hash) => {
            if (err) return res.status(500).send(err);

            const sql = 'INSERT INTO admins (name,email,password_hash,phone,role) VALUES (?,?,?,?,?)';
            db.execute(sql, [name,email,password_hash,phone,role], (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).json({ admin_id: result.insertId, name, email, phone, role });
            });
        });
    });
});

// Get all admins ( super_admin )
router.get('/', authorizeRoles("super_admin"), (req, res) => {
    db.execute('SELECT * FROM admins', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Get admin by ID ( super_admin )
router.get('/:id', authorizeRoles("super_admin"), (req, res) => {
    const { id } = req.params;
    db.execute('SELECT * FROM admins WHERE admin_id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Not Found');
        res.json(result[0]);
    });
});

// Update admin ( super_admin )
router.put('/:id', authorizeRoles("super_admin"), (req, res) => {
    const { id } = req.params;
    const { name, email, password, phone, role } = req.body;

    if (!validator.isEmail(email) || !['super_admin','admin'].includes(role)) {
        return res.status(400).send('Invalid input');
    }

    db.execute('SELECT admin_id FROM admins WHERE email=? AND admin_id !=?', [email, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) return res.status(409).send('Email already exists');

        bcrypt.hash(password, 10, (err, password_hash) => {
            if (err) return res.status(500).send(err);

            const sql = 'UPDATE admins SET name=?, email=?, password_hash=?, phone=?, role=? WHERE admin_id=?';
            db.execute(sql, [name,email,password_hash,phone,role,id], (err, result) => {
                if (err) return res.status(500).send(err);
                if (result.affectedRows === 0) return res.status(404).send('Not found');
                res.json({ id, name, email, phone, role });
            });
        });
    });
});

// Delete admin ( super_admin )
router.delete('/:id', authorizeRoles("super_admin"), (req, res) => {
    const { id } = req.params;
    db.execute('DELETE FROM admins WHERE admin_id=?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Not found');
        res.send('Deleted');
    });
});

module.exports = router;
