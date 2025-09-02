// createSuperAdminWithToken.js
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

async function createSuperAdmin() {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'magellansaudi'
    });

    const name = ' Admin';
    const email = 'superq@domain.com';
    const password = 'SuperStrongPass123';
    const phone = '05000000';
    const role = 'admin';

    try {
      
        const password_hash = await bcrypt.hash(password, 10);

       
        db.execute(
            'INSERT INTO admins (name, email, password_hash, phone, role) VALUES (?,?,?,?,?)',
            [name, email, password_hash, phone, role],
            (err, result) => {
                if (err) {
                    console.error('Error inserting super_admin:', err);
                    db.end();
                    return;
                }

                console.log(' Super admin created with ID:', result.insertId);

             
                const token = jwt.sign(
                    { admin_id: result.insertId, email, role },
                    SECRET_KEY,
                    { expiresIn: '1h' }
                );

                console.log('🔑 JWT Token:', token);
                console.log('Use this token in Authorization header: Bearer <token>');

                db.end();
            }
        );
    } catch (err) {
        console.error('Error:', err);
        db.end();
    }
}

createSuperAdmin();
