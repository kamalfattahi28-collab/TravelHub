const { AsyncLocalStorage } = require("async_hooks");
const { randomUUID } = require("crypto");
const logger = require('../utils/logger');

const asyncLocalStorage = new AsyncLocalStorage();

function asyncContextMiddleware(req, res, next) {
    const requestId = randomUUID();
    const store = {
        requestId,
        user:  null,
        startTime: Date.now(),
        logger: logger
    };
    asyncLocalStorage.run(store, () => next());
}

function getContext() {
    return asyncLocalStorage.getStore();
}

module.exports = { asyncContextMiddleware, getContext };
