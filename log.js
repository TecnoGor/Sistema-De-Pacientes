const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

const SECRET_KEY = 'MAMALO';

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sicven',
    password: 'postgres',
    port: 5432,
});

// Función para encriptar la contraseña en SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { firstname, secondname, ci, mail, phone, username, password, status, rol } = req.body;
    const passwordHash = hashPassword(password);

    try {
        const result = await pool.query(
            'INSERT INTO users (firstname, secondname, ci, mail, phone, username, password, status, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [firstname, secondname, ci, mail, phone, username, passwordHash, status, rol]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = hashPassword(password);

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, passwordHash]
        );
        if (result.rows.length > 0) {
            const token = jwt.sign({ userId: result.rows[0].codper }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token});
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para consultar los usuarios
app.post('/api/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, firstname, secondname, mail, phone, username, status, rol FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(501).send('Error al obtener los datos');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});