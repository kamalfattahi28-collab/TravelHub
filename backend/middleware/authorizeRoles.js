const { getContext } = require("./asyncContext");

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const ctx = getContext();

        if (!ctx || !ctx.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!allowedRoles.includes(ctx.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }

        next();
    };
}

module.exports = authorizeRoles;
