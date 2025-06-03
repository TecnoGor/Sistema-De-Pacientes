const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sicven',
  password: 'postgres',
  port: 5432,
});

// Ruta para obtener los datos de la base de datos
app.get('/api/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, firstname, secondname, mail, phone, username, status, rol FROM users');
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
  console.log(`Servidor corriendo en http://localhost:${port}`);
});