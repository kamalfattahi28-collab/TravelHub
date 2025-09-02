const { createLogger, format, transports } = require("winston");
const { getContext } = require("../middleware/asyncContext");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(info => {
            try {
                const ctx = getContext();
                const requestId = ctx?.requestId || "no-req-id";
                return `[${info.timestamp}] [${requestId}] ${info.level.toUpperCase()}: ${info.message}`;
            } catch (error) {
                return `[${info.timestamp}] [no-req-id] ${info.level.toUpperCase()}: ${info.message}`;
            }
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/app.log" })
    ]
});

module.exports = logger;
