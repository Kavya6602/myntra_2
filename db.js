"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
const db = pgp({
    host: 'localhost',
    user: 'postgres',
    password: 'Monterox@02',
    database: 'Myntra',
    port: 5432
});
// console.log("Database connected");
db.connect()
    .then(() => {
    console.log("Database connected");
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
exports.default = { db };
