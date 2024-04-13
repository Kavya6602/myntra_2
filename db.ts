import pg from 'pg';
import pgPromise from 'pg-promise';
const pgp = pgPromise();
import { IClient } from 'pg-promise/typescript/pg-subset';

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
    .catch((error: Error) => {
        console.error('Error connecting to the database:', error);
    });

export default { db };


