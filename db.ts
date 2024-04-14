// import pg from 'pg';
// import pgPromise from 'pg-promise';
// const pgp = pgPromise();
// import { IClient } from 'pg-promise/typescript/pg-subset';

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


import  pgPromise, { IDatabase, IMain } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

// Create pg-promise instance
const pgp: IMain = pgPromise();

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'Monterox@02',
    database: 'Myntra',
    port: 5432 
};

// Create a new database connection
const db: IDatabase<{}, IClient> = pgp(dbConfig);

// Log database connection status
db.connect()
    .then(() => {
        console.log("Database connected");
    })
    .catch((error: Error) => {
        console.error('Error connecting to the database:', error);
    });

// Export the typed database object
export default db;
