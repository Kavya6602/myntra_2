"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = exports.getUser = void 0;
const db_1 = __importDefault(require("./db"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
// import { IClient } from 'pg-promise/typescript/pg-subset';
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset } = req.query;
        // Call the stored procedure
        const query = 'SELECT * FROM get_users($1, $2)';
        const results = yield db_1.default.any(query, [limit, offset]);
        res.status(200).send({ message: "All data returned", result: results });
    }
    catch (e) {
        const error = e;
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.getUser = getUser;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, is_active, email, password } = req.body;
        if (!name || !is_active || !email || !password) {
            console.log(name, is_active, email, password);
            return res.status(400).json({ message: 'Name, Active status, Email and Password are all required' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Execute the function directly
        const query = 'SELECT register_user($1, $2, $3, $4) AS result';
        const result = yield db_1.default.any(query, [name, is_active, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully', result: result.result });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.JWT_SECRET_KEY;
        // Validate the fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        // Call the stored procedure
        const query = `SELECT * FROM login_user($1, $2)`;
        const result = yield db_1.default.any(query, [email, password]);
        if (result.length === 0) {
            throw new Error('User not found');
        }
        const storedHashedPassword = result[0].password;
        const match = yield bcrypt_1.default.compare(password, storedHashedPassword);
        if (match) {
            const token = jsonwebtoken_1.default.sign({ user_id: result[0].user_id }, secretKey, { expiresIn: '1h' });
            res.status(200).json({
                message: "Successful login",
                user_id: result[0].user_id,
                token: token
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = () => Math.floor(1000 + Math.random() * 9000);
        const otpCall = otp();
        const { email } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email field is required' });
            return;
        }
        // Call the function
        const query = `SELECT * from forgot_password($1,$2)`;
        const result = yield db_1.default.any(query, [email, otpCall]);
        console.log(result);
        res.status(200).send({ message: `A one-time password has been sent to your email address ${email}`, result: result[0] });
    }
    catch (e) {
        const error = e;
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            res.status(400).send({ message: "Please provide all the details" });
            return;
        }
        // console.log(email, otp, password)/
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Call the function
        const query = `SELECT * from reset_password($1, $2, $3)`;
        const [result] = yield db_1.default.any(query, [email, otp, hashedPassword]);
        // console.log(result)
        res.status(200).send({ message: "Password changed successfully", result: result[0] });
    }
    catch (e) {
        const error = e;
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
exports.resetPassword = resetPassword;
router.get('/users', middleware_1.addRequestId, middleware_1.logRequest, exports.getUser);
router.post('/register', middleware_1.addRequestId, middleware_1.logRequest, exports.register);
router.post('/login', middleware_1.addRequestId, middleware_1.logRequest, exports.login);
router.post('/forgotpassword', middleware_1.addRequestId, middleware_1.logRequest, exports.forgotPassword);
router.post('/resetpassword', middleware_1.addRequestId, middleware_1.logRequest, exports.resetPassword);
