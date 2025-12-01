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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/referencias/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB límite
    },
    fileFilter: function (req, file, cb) {
      // Validar tipos de archivo
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos PDF e imágenes'));
      }
    }
  });

// Función para encriptar la contraseña en SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Ruta para registrar un nuevo usuario
app.post('/api/regUser', async (req, res) => {
    const { id_persona, username, password, status, rol } = req.body;
    const passwordHash = hashPassword(password);

    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nuser, password, rolid, status, id_persona) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, passwordHash, rol, status, id_persona]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/regPersona', async (req, res) => {
    const { ci, typeCi, firstname, lastname  } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO persona (cedula, nombres, apellidos, tipoci) VALUES ($1, $2, $3, $4) RETURNING id_persona',
            [ci, firstname, lastname, typeCi]
        );
        const id_persona = result.rows[0].id_persona;
        res.status(201).json({
            success: true,
            message: "Persona Registrada",
            id_persona: id_persona
        });
    } catch (err) {
        if (err.code === '23505') {
            console.log("Cedula existente");
            res.status(500).json({
                error: "Cedula duplicada",
                message: "La cedula ya se encuentra registrada",
                code: err.code,
            });

        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.get('/api/selectPersona/:ci', async (req, res) => {
    const { ci } = req.params;

    try {
        const result = await pool.query(
            'SELECT a.id_persona, a.nombres, a.apellidos, a.tipoci, a.cedula, b.id_dpersonales FROM persona a LEFT JOIN datospersonales b ON b.personaid = a.id_persona WHERE a.cedula = $1',
            [ci]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.json({});
        }
    } catch (err) {
        console.error('Error detallado:', {
            message: err.message,
            stack: err.stack,
            query: 'SELECT id_persona FROM persona WHERE ci = $1',
            parametro: ci
        });
        res.status(500).json({ 
            error: 'Error al consultar la base de datos',
            detalle: err.message 
        });
    }
});

app.get('/api/paciente/:id_persona', async (req, res) => {
    const { id_persona } = req.params;

    try {
        const result = await pool.query(
            'SELECT p.id_persona, dp.id_dpersonales, p.nombres, p.apellidos, p.tipoci, p.cedula, dp.correo, dp.telefono, dp.fechanac, dp.edocivil, dp.nivinst, dp.profesion, dp.direccion, pc.referencia, pc.excepcion, pc.representanteid, pc.tipopaciente, pc.carnetafiliado, pc.carnetmilitar, pc.gradom, pc.componentem FROM paciente pc INNER JOIN datospersonales dp ON dp.id_dpersonales = pc.dpersonalesid INNER JOIN persona p ON p.id_persona = dp.personaid WHERE p.id_persona=$1',
            [id_persona]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.json({});
        }
    } catch (err) {
        console.error(err);
        res.status(501).send('Error al obtener los datos');
    }
});

app.get('/api/pacienteII/:ci', async (req, res) => {
    const { ci } = req.params;

    try {
        const result = await pool.query(
            'SELECT p.id_persona, dp.id_dpersonales, pc.id_paciente, p.nombres, p.apellidos FROM paciente pc LEFT JOIN datospersonales dp ON dp.id_dpersonales = pc.dpersonalesid LEFT JOIN persona p ON p.id_persona = dp.personaid WHERE p.cedula=$1',
            [ci]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (err) {
        // console.error('❌ Error en consulta:', err);
        // res.status(500).json({ error: 'Error al obtener los datos', details: err.message });
        console.error(err);
        res.status(501).send('Error al obtener los datos');
    }
});

app.post('/api/regDatosPersonales', async (req, res) => {
    const { personaId, mail, phone, bdate, scivil, studios, ocupation, state, municipio, parroquia, dirhouse } = req.body;
    const direccionCompleta = state + ", Municipio " + municipio + ", Parroquia " + parroquia + ", " + dirhouse;

    try {
        const result = await pool.query(
            'INSERT INTO datospersonales (personaid, correo, telefono, fechanac, edocivil, nivinst, profesion, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_dpersonales',
            [personaId, mail, phone, bdate, scivil, studios, ocupation, direccionCompleta]
        );

        const id_dpersonales = result.rows[0].id_dpersonales;

        res.status(201).json({
            success: true,
            message: 'Datos Personales registrados exitosamente',
            dpersonalesid: id_dpersonales,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

app.get('/api/medicos', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id_usuario, p.id_persona, p.nombres, p.apellidos, p.cedula
             FROM usuarios u
             INNER JOIN persona p ON u.id_persona = p.id_persona
             WHERE u.rolid = $1 AND u.status = '1'`,
            [3] // ID del rol médico (ajusta según tu base de datos)
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener médicos:', err);
        res.status(500).json({ error: 'Error al obtener la lista de médicos' });
    }
});

app.post('/api/regPacientes', upload.single('referencia'), async (req, res) => {
    const { dpersonalesId, excepcionD, representanteid, typePaciente, carnetA, carnetM, gradoM, componenteM } = req.body;
    const referenciaDir = req.file ? req.file.path : null;
    try {
        const result = await pool.query(
            'INSERT INTO paciente (dpersonalesid, referencia, excepcion, representanteid, tipopaciente, carnetafiliado, carnetmilitar, gradoM, componenteM) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [dpersonalesId, referenciaDir, excepcionD, representanteid, typePaciente, carnetA, carnetM, gradoM, componenteM]
        );
        res.status(201).json({
            success: true,
            message: "Paciente registrado exitosamente",
            data: result.rows[0]
        })
    } catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.post('/api/regConsultas', async (req, res) => {
    const { ci, pacienteId, firstname, lastname, codconsul, fechaConsul, motivo, diagnostic, tratment, medicoid, status } = req.body;
    const medvint= parseInt(medicoid);
    try {
        const result = await pool.query(
            'INSERT INTO consultamedica (pacienteid, codconsul, motivo, diagnostic, tratment, medicoid, fechaconsul, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [pacienteId, codconsul, motivo, diagnostic, tratment, medvint, fechaConsul, status]
        );
        res.status(201).json({
            success: true,
            message: "Consulta registrada exitosamente",
            data: result.rows[0]
        })
    } catch (err) {
        console.error('Error al obtener:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.post('/api/regAdvanceConsul', async (req, res) => {
    const { id_conmed, tiempo_tratamiento, fecha_avance, estado_paciente, diagnostico_avance } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO avance_consultas (id_conmed, tiempo_tratamiento, fecha_avance, estado_paciente, diagnostico) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_conmed, tiempo_tratamiento, fecha_avance, estado_paciente, diagnostico_avance]
        );
        res.status(201).json({
            success: true,
            message: "Avance registrado exitosamente",
            data: result.rows[0]
        })
    } catch (err) {
        console.error('Error al obtener:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
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
        const { rows } = await pool.query('SELECT u.id_usuario, u.nuser, u.rolid, r.nrol, u.fechacreacion FROM usuarios u INNER JOIN roles r ON r.id_rol = u.rolid');
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

app.get('/api/consultaMedica/:id_conmed', async (req, res) => {
    const { id_conmed } = req.params;

  try {
    const result = await pool.query(`
        SELECT 
            cm.id_conmed,
            cm.codconsul, 
            pn_paciente.nombres AS nombres_paciente,
            pn_paciente.apellidos AS apellidos_paciente, 
            pn_paciente.cedula AS cedula_paciente,
            dp_paciente.correo AS correo_paciente,
            dp_paciente.telefono AS telefono_paciente,
            cm.fechaconsul,
            pn_medico.nombres AS nombres_medico,
            pn_medico.apellidos AS apellidos_medico,
            pn_medico.cedula AS cedula_medico,
            cm.fechaingreso AS fecha_ingreso,
            cm.diagnostic AS diagnostic,
            cm.tratment AS tratment
        FROM consultamedica cm 
            INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
            INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
            INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
            INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
            INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
        WHERE cm.id_conmed = $1;
    `, [id_conmed]);

    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    } else {
        res.json({});
    }
  } catch (err) {
      console.error(err);
      res.status(501).send('Error al obtener los datos');
  }
});

app.get('/api/consultasMedicas', async (req, res) => {
    try {
      const { rows } = await pool.query(`
          SELECT 
              cm.id_conmed,
              cm.codconsul, 
              pn_paciente.nombres AS nombres_paciente,
              pn_paciente.apellidos AS apellidos_paciente, 
              pn_paciente.cedula AS cedula_paciente,
              dp_paciente.correo AS correo_paciente,
              dp_paciente.telefono AS telefono_paciente,
              cm.fechaconsul,
              pn_medico.nombres AS nombres_medico,
              pn_medico.apellidos AS apellidos_medico,
              pn_medico.cedula AS cedula_medico,
              cm.fechaingreso AS fecha_ingreso,
              cm.diagnostic AS diagnostic,
              cm.tratment AS tratment
          FROM consultamedica cm 
              INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
              INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
              INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
              INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
              INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona;
      `);
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