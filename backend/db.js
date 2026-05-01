import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

console.log("🔥 DB URL in db.js:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 1,
});

export default pool;