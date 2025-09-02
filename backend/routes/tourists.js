const express = require("express");
const mysql = require('mysql2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const asyncContext = require('../middleware/asyncContext');

const router = express.Router();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'magellansaudi'
});

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

// 🟢 AllowAnonymous: login
router.post('/login', (req, res) => {
    const ctx = asyncContext.getContext();
    const { email, password } = req.body;
    console.log(`[Tourist Login Attempt] email: ${email}`);

    if (!validator.isEmail(email)) {
        console.log(`[Tourist Login Failed] Invalid email: ${email}`);
        return res.status(400).send('Invalid email');
    }

    db.promise().execute('SELECT * FROM tourists WHERE email=?', [email])
        .then(([rows]) => {
            if (rows.length === 0) return res.status(404).send('Email not found');

            const user = rows[0];
            return bcrypt.compare(password, user.password_hash)
                .then((isMatch) => {
                    if (!isMatch) return res.status(401).send('Wrong password');

                    const token = jwt.sign({ tourist_id: user.tourist_id, email: user.email, role: 'tourist' }, SECRET_KEY, { expiresIn: "1h" });
                    console.log(`[Tourist Login Success] ${email}`);
                    res.json({ message: 'login success', token });
                });
        })
        .catch((err) => {
            console.error('Login error:', err);
            res.status(500).send('Login failed');
        });
});

// 🟢 AllowAnonymous: register (  tourist only )
router.post('/', (req, res) => {
    const { name, email, password, gender, profile_picture } = req.body;
    console.log(`[Tourist Register Attempt] email: ${email}`);

    if (!validator.isEmail(email) || !['male', 'female'].includes(gender)) {
        return res.status(400).send('Invalid input');
    }

    db.promise().execute('SELECT email FROM tourists WHERE email=?', [email])
        .then(([rows]) => {
            if (rows.length > 0) return res.status(409).send('Email already exists');

            return bcrypt.hash(password, 10);
        })
        .then((password_hash) => {
            return db.promise().execute(
                'INSERT INTO tourists (name,email,password_hash,gender,profile_picture) VALUES (?,?,?,?,?)',
                [name,email,password_hash,gender,profile_picture]
            );
        })
        .then(([result]) => {
            console.log(`[Tourist Register Success] ${email}`);
            res.status(201).json({ tourist_id: result.insertId, name, email, gender, profile_picture });
        })
        .catch((err) => {
            console.error('Registration error:', err);
            res.status(500).send('Registration failed');
        });
});

// Protected Routes
router.use(authMiddleware);


// Get all tourists (admin or superadmin)

router.get('/', authorizeRoles("admin","superadmin"), (req, res) => {
    asyncContext.logger.info(`[Get All Tourists] by user ${req.user.id}`);
    db.execute('SELECT * FROM tourists', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Get tourist by ID (admin + super_admin)
router.get('/:id', authorizeRoles("admin", "super_admin"), (req, res) => {
    const { id } = req.params;
    db.execute('SELECT * FROM tourists WHERE tourist_id=?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Not Found');
        res.json(result[0]);
    });
});

// Update tourist (admin or superadmin)
router.put('/:id', authorizeRoles("admin","superadmin"), (req, res) => {
    const { id } = req.params;
    const { name, email, password, gender, profile_picture } = req.body;

    if (!validator.isEmail(email) || !['male', 'female'].includes(gender)) {
        return res.status(400).send('Invalid input');
    }

    db.execute('SELECT tourist_id FROM tourists WHERE email=? AND tourist_id !=?', [email, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) return res.status(409).send('Email already exists');

        bcrypt.hash(password, 10, (err, password_hash) => {
            if (err) return res.status(500).send(err);

            db.execute(
                'UPDATE tourists SET name=?, email=?, password_hash=?, gender=?, profile_picture=? WHERE tourist_id=?',
                [name,email,password_hash,gender,profile_picture,id],
                (err, result) => {
                    if (err) return res.status(500).send(err);
                    if (result.affectedRows === 0) return res.status(404).send('Not found');
                    res.json({ id, name, email, gender, profile_picture });
                }
            );
        });
    });
});

// Delete tourist (super_admin only)
router.delete('/:id', authorizeRoles("super_admin"), (req, res) => {
    const { id } = req.params;
    db.execute('DELETE FROM tourists WHERE tourist_id=?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Not found');
        res.send('Deleted');
    });
});

module.exports = router;
