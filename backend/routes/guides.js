const express = require('express');
const mysql = require('mysql2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { getContext } = require('../middleware/asyncContext');

const router = express.Router();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'magellansaudi'
});

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

//  SIGNUP 
router.post('/', async (req, res) => {
    const ctxStart = getContext();
    console.log("🔹 ctx at start of /guides POST:", ctxStart);

    try {
        const { name, email, password, gender, profile_picture, is_verified = 0 } = req.body;

        if (!validator.isEmail(email) || !['male', 'female'].includes(gender)) {
            return res.status(400).send('Invalid input');
        }

        const [rows] = await db.promise().execute('SELECT email FROM guides WHERE email=?', [email]);
        if (rows.length > 0) return res.status(409).send('Email already exists');

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.promise().execute(
            'INSERT INTO guides (name,email,password_hash,gender,profile_picture,is_verified) VALUES (?,?,?,?,?,?)',
            [name,email,password_hash,gender,profile_picture,is_verified]
        );

        console.log("✅ ctx after successful signup:", getContext());
        res.status(201).json({ guides_id: result.insertId, name, email, gender, profile_picture, is_verified });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

//  LOGIN (guide login)
router.post('/login', async (req, res) => {
     const ctxStart = getContext();
    console.log("🔹 ctx at start of /login:", ctxStart);
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) return res.status(400).send('Invalid email');

        const [rows] = await db.promise().execute('SELECT * FROM guides WHERE email=?', [email]);
        if (rows.length === 0) return res.status(404).send('Email not found');

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).send('Wrong password');

        const token = jwt.sign(
            { guides_id: user.guides_id, email: user.email, role: "guide" }, 
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        const ctxAfter = getContext();
        ctxAfter.user = { guides_id: user.guides_id, email: user.email };
        console.log("🔹 ctx after login success:", ctxAfter);
        res.json({ message: 'login success', token });
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message);
    }
});

// 🟢 Protected routes
router.use(authMiddleware);

// Get all guides ( admin + super_admin )
router.get('/', authorizeRoles("admin","super_admin"), async (req, res) => {
      const ctx = getContext();
    console.log("🔹 ctx inside GET /guides:", ctx);
    try {
        
        const [rows] = await db.promise().execute('SELECT * FROM guides');
        res.json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get guide by ID ( admin + super_admin )

router.get('/:id', authorizeRoles("admin","super_admin"), async (req, res) => {
    const ctx = getContext();
     const { id } = req.params;
    console.log(`🔹 ctx inside GET /guides/${id}:`, ctx);
    try {
        
        const [rows] = await db.promise().execute('SELECT * FROM guides WHERE guides_id=?', [id]);
        if (rows.length === 0) return res.status(404).send('Not Found');
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Update guide (  admin + super_admin)
router.put('/:id', authorizeRoles("admin","super_admin"), async (req, res) => {
      const ctx = getContext();
    const { id } = req.params;
    const { name, email, password, gender, profile_picture, is_verified } = req.body;
    console.log(`🔹 ctx inside PUT /guides/${id}:`, ctx);
    try {
        

        const [rows] = await db.promise().execute('SELECT guides_id FROM guides WHERE email=? AND guides_id !=?', [email, id]);
        if (rows.length > 0) return res.status(409).send('Email already exists');

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.promise().execute(
            'UPDATE guides SET name=?, email=?, password_hash=?, gender=?, profile_picture=?, is_verified=? WHERE guides_id=?',
            [name,email,password_hash,gender,profile_picture,is_verified,id]
        );

        if (result.affectedRows === 0) return res.status(404).send('Not found');
        console.log(` ctx after updating guide ${id}:`, getContext());
        res.json({ id, name, email, gender, profile_picture, is_verified });
    } catch (err) {
         console.error(err);
        res.status(500).send(err.message);
    }
});

// Delete guide ( super_admin )
router.delete('/:id', authorizeRoles("super_admin"), async (req, res) => {
      const ctx = getContext();
    const { id } = req.params;
    console.log(`🔹 ctx inside DELETE /guides/${id}:`, ctx);
    try {
       
        const [result] = await db.promise().execute('DELETE FROM guides WHERE guides_id=?', [id]);
        if (result.affectedRows === 0) return res.status(404).send('Not found');
        console.log(` ctx after deleting guide ${id}:`, getContext());
        res.send('Deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
