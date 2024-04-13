"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParams = exports.logRequest = exports.addRequestId = exports.generateUUID = void 0;
const uuid_1 = require("uuid");
const generateUUID = () => {
    return (0, uuid_1.v4)();
};
exports.generateUUID = generateUUID;
const addRequestId = (req, res, next) => {
    req.headers["request_id"] = (0, exports.generateUUID)();
    console.log(`Request id - ${req.headers['request_id']}`);
    next();
};
exports.addRequestId = addRequestId;
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}]  Method: ${req.method}, URL: ${req.url}`);
    next();
};
exports.logRequest = logRequest;
const validateQueryParams = (req, res, next) => {
    const { limit, offset } = req.query;
    const limitNumber = parseInt(limit, 10);
    const offsetNumber = parseInt(offset, 10);
    if (!limit || !offset || limitNumber < 0 || offsetNumber < 0) {
        return res.status(400).send({ message: 'Invalid limit or offset values' });
    }
    next();
};
exports.validateQueryParams = validateQueryParams;
