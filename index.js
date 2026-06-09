import 'dotenv/config';

import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.DATABASE_URL;

app.use(cors());

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/init', async (_req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT
            )
        `);

        res.send('users table created (if not exists)');

        await pool.query(`
            INSERT INTO users (name)
            VALUES ('Alice'), ('Bob'), ('Charlie')
        `);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get('/users', async (_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');

        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.listen(port, () => {
    console.log(`Server listening on https://localhost:${port}`);
})
