"use strict";
// import pg from 'pg';
// import pgPromise from 'pg-promise';
// const pgp = pgPromise();
// import { IClient } from 'pg-promise/typescript/pg-subset';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const db = pgp({
//     host: 'localhost',
//     user: 'postgres',
//     password: 'Monterox@02',
//     database: 'Myntra',
//     port: 5432 
// });
// // console.log("Database connected");
// db.connect()
//     .then(() => {
//         console.log("Database connected");
//     })
//     .catch((error: Error) => {
//         console.error('Error connecting to the database:', error);
//     });
// export default { db };
const pg_promise_1 = __importDefault(require("pg-promise"));
// Create pg-promise instance
const pgp = (0, pg_promise_1.default)();
// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'Monterox@02',
    database: 'Myntra',
    port: 5432
};
// Create a new database connection
const db = pgp(dbConfig);
// Log database connection status
db.connect()
    .then(() => {
    console.log("Database connected");
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
// Export the typed database object
exports.default = db;
// import { Pool } from 'pg';
// // Database configuration
// const dbConfig = {
//     host: 'localhost',
//     user: 'postgres',
//     password: 'Monterox@02',
//     database: 'Myntra',
//     port: 5432 
// };
// // Create a new database connection pool
// const db = new Pool(dbConfig);
// // Log database connection status
// db.connect()
//     .then(() => {
//         console.log("Database connected");
//     })
//     .catch((error: Error) => {
//         console.error('Error connecting to the database:', error);
//     });
// // Export the database connection pool
// export default db;
