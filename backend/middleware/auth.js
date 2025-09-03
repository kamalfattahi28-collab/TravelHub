const jwt = require("jsonwebtoken");
const { getContext } = require("./asyncContext");

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        console.log(" No token in request");
        return res.status(401).json({ message: "Access denied. No token" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log(" Invalid token:", err.message);
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;

        const ctx = getContext();
        if (ctx) {
            ctx.user = user;
            console.log(" authMiddleware set ctx.user:", ctx);
        } else {
            console.log(" No ctx found in authMiddleware");
        }

        next();
    });
}

module.exports = authMiddleware;
