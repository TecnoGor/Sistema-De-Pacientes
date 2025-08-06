const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.development' });

const app = express();
const port = process.env.REACT_APP_API_PORT;

const SECRET_KEY = process.env.REACT_APP_API_KEY;
const corsOptions = {
    origin: [
        process.env.REACT_APP_ORIGIN_URL,
        process.env.REACT_APP_ORIGIN_LOCAL,
        process.env.REACT_APP_ORIGIN_HOST
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const pool = new Pool({
    user: process.env.REACT_APP_DB_USER,
    host: process.env.REACT_APP_DB_HOST,
    database: process.env.REACT_APP_DB_NAME,
    password: process.env.REACT_APP_DB_PASSWORD,
    port: process.env.REACT_APP_DB_PORT,
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

app.post('/regPersona', async (req, res) => {
    const { cedula, nombres, apellidos } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO persona (cedula, nombres, apellidos) VALUES ($1, $2, $3) RETURNING *',
            [cedula, nombres, apellidos]
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
    const status = 1;

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE nuser = $1 AND password = $2 AND status = $3',
            [username, passwordHash, status]
        );
        if (result.rows.length > 0) {
            const token = jwt.sign({ id_usuario: result.rows[0].id_usuario }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token});
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('verify-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('')[1];
        if (!token) return res.json({ valid: false });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [decoded.id_usuario]);

        if (user.length === 0) return res.json({ valid: false });

        res.json({
            valid: true,
            user: {
                id_usuario: user.rows[0].id_usuario,
                nuser: user.rows[0].nuser,
                rol: user.rows[0].rolid
            }
        })
    } catch (err) {
        res.json({ valid: false });
    }
});

app.post('logout', async (req, res) => {
    // Desarrollo de invalidacion de token para lista negra
});

// Ruta para consultar los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id_usuario, nuser, rolid, fechacreacion FROM usuarios');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(501).send('Error al obtener los datos');
    }
});

app.get('/api/pacientes', async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT p.id_persona, p.nombres, p.apellidos, p.cedula FROM paciente pc INNER JOIN datospersonales dp ON dp.id_dpersonales = pc.dpersonalesid INNER JOIN persona p ON p.id_persona = dp.personaid');
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(501).send('Error al obtener los datos');
  }
});

app.get('/api/especialistas', async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT p.id_persona, p.nombres, p.apellidos, p.cedula FROM medico m INNER JOIN datospersonales dp ON dp.id_dpersonales = m.dpersonalesid INNER JOIN persona p ON p.id_persona = dp.personaid');
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(501).send('Error al obtener los datos');
  }
});

app.get('/api/consultasMedicas', async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT cm.codconsul, pn.nombres, pn.apellidos, cm.fechaingreso FROM consultamedica cm INNER JOIN paciente p ON cm.pacienteid = p.id_paciente INNER JOIN datospersonales dp ON p.dpersonalesid = dp.id_dpersonales INNER JOIN persona pn ON dp.personaid = pn.id_persona');
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(501).send('Error al obtener los datos');
  }
});

app.get('/api/color_ger/:codger', async (req, res) => {
  const { codger } = req.params;
  try {
    console.log(`Consultando codger: ${codger}`); // Log para depuración
    
    const result = await pool.query(
      'SELECT codger, color FROM gerencia_color WHERE codger = $1', 
      [codger]
    );
    
    console.log(`Resultados encontrados: ${result.rows.length}`); // Log para depuración
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('Error detallado:', {
      message: err.message,
      stack: err.stack,
      query: 'SELECT codger, color FROM gerencia_color WHERE codger = $1',
      parametro: codger
    });
    res.status(500).json({ 
      error: 'Error al consultar la base de datos',
      detalle: err.message 
    });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});