const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const { asyncContextMiddleware } = require('./middleware/asyncContext');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();


app.use(helmet());
app.use(express.json());
app.use(asyncContextMiddleware);


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


const admins = require(path.join(__dirname, 'routes', 'admins'));
const tourists = require(path.join(__dirname, 'routes', 'tourists'));
const guides = require(path.join(__dirname, 'routes', 'guides'));
const bookings = require(path.join(__dirname, 'routes', 'booking'));
const notifications = require(path.join(__dirname, 'routes', 'notifications'));
const licenses = require(path.join(__dirname, 'routes', 'licenses'));
const passwordResets = require(path.join(__dirname, 'routes', 'password_resets'));
const payments = require(path.join(__dirname, 'routes', 'payments'));
const ratingsComments = require(path.join(__dirname, 'routes', 'ratings_comments'));
const tours = require(path.join(__dirname, 'routes', 'tours'));

app.use('/admins', admins);
app.use('/tourists', tourists);
app.use('/guides', guides);
app.use('/booking', bookings);
app.use('/notifications', notifications);
app.use('/licenses', licenses);
app.use('/password_resets', passwordResets);
app.use('/payments', payments);
app.use('/ratings_comments', ratingsComments);
app.use('/tours', tours);


app.use((req, res, next) => {
    logger.info(`Route not found: ${req.originalUrl}`);
    res.status(404).json({ err: 'Route not found' });
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Express server running securely on http://localhost:${PORT}`);
    console.log(' asyncContextMiddleware loaded, ready to track getContext() for each request');
});
