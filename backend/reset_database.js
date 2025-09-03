const mysql = require('mysql2');

// Create connection without specifying database first
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

async function resetDatabase() {
    try {
        console.log('Dropping and recreating database...');
        
        // Drop database if exists
        await new Promise((resolve, reject) => {
            connection.query('DROP DATABASE IF EXISTS magellansaudi', (err, result) => {
                if (err) {
                    console.error('Error dropping database:', err.message);
                    reject(err);
                } else {
                    console.log('Database dropped successfully');
                    resolve(result);
                }
            });
        });
        
        // Create database
        await new Promise((resolve, reject) => {
            connection.query('CREATE DATABASE magellansaudi', (err, result) => {
                if (err) {
                    console.error('Error creating database:', err.message);
                    reject(err);
                } else {
                    console.log('Database created successfully');
                    resolve(result);
                }
            });
        });
        
        // Use the database
        await new Promise((resolve, reject) => {
            connection.query('USE magellansaudi', (err, result) => {
                if (err) {
                    console.error('Error using database:', err.message);
                    reject(err);
                } else {
                    console.log('Using database magellansaudi');
                    resolve(result);
                }
            });
        });
        
        console.log('Database reset completed successfully!');
        connection.end();
    } catch (error) {
        console.error('Database reset failed:', error);
        connection.end();
        process.exit(1);
    }
}

resetDatabase();
