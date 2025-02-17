import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

// Load environment variables
dotenv.config();

// Connect to Neon PostgreSQL
const pool = new Pool({
    connectionString: process.env.NEON_CONNECTION_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon
});

// Function to create table
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `;

    try {
        await pool.query(query);
        console.log("✅ Table 'users' created successfully!");
    } catch (err) {
        console.error("❌ Error creating table:", err);
    } finally {
        pool.end(); // Close connection
    }
};

// Run function
createTable();
