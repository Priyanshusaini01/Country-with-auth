import dotenv from 'dotenv';
import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const { Pool } = pkg;

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// **Connect to Neon PostgreSQL**
const pool = new Pool({
    connectionString: process.env.NEON_CONNECTION_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon
});

// **User Registration**
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
        const result = await pool.query(query, [username, hashedPassword]);

        res.json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// **User Login**
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Verify Token Route**
app.post('/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ valid: false, error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, error: "Invalid token" });
        }
        res.json({ valid: true, user: decoded });
    });
});

// **Start Server & Open Browser**
const PORT = 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    open(`http://localhost:${PORT}`);
});
