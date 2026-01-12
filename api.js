const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const PizZip = require('pizzip');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Docxtemplater = require('docxtemplater');
const PDFDocument = require('pdf-lib').PDFDocument;
const puppeteer = require('puppeteer');
require('dotenv').config({ path: '.env.development' });
const mammoth = require('mammoth');

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

const folders = ['uploads/referencias', 'plantillas', 'temp'];
folders.forEach(folder => {
    const fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
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

app.post('/api/generar-consentimiento/:id_persona', async (req, res) => {
    console.log('🔔 ===== ENDPOINT LLAMADO =====');
    console.log('📌 Método:', req.method);
    console.log('📌 URL:', req.url);
    console.log('📌 id_persona recibido:', req.params.id_persona);
    
    try {
        const { id_persona } = req.params;
        
        // 1. Obtener datos del paciente por id_persona
        console.log('📋 Buscando datos del paciente...');
        const pacienteData = await obtenerDatosParaConsentimiento(id_persona);
        console.log('✅ Datos del paciente encontrados:', {
            nombres: pacienteData.nombres_paciente,
            apellidos: pacienteData.apellidos_paciente,
            cedula: pacienteData.cedula_paciente
        });
        
        // 2. Preparar datos para la plantilla
        const templateData = {
            paciente_nombres: pacienteData.nombres_paciente || '',
            paciente_apellidos: pacienteData.apellidos_paciente || '',
            paciente_edad: calcularEdad(pacienteData.fechanac) || 'N/A',
            paciente_cedula: pacienteData.cedula_paciente || '',
            paciente_direccion: pacienteData.direccion || 'No especificada',
            medico_nombres: 'MÉDICO TRATANTE',
            medico_apellidos: '',
            medico_registro: 'N/A',
            diagnostico: 'Enfermedad que requiere oxigenoterapia hiperbárica',
            protocolo: 'Protocolo estándar de oxigenoterapia hiperbárica',
            aceptacion_si: '☑',
            aceptacion_no: '☐',
            fecha_hora: new Date().toLocaleString('es-VE', {
                timeZone: 'America/Caracas',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            medico_firma: 'MÉDICO TRATANTE'
        };
        
        console.log('📄 Datos preparados para plantilla');
        
        // 3. Generar documento Word desde plantilla
        console.log('🔄 Generando documento Word...');
        const wordBuffer = await generarConsentimientoWord(templateData);
        console.log('✅ Documento Word generado, tamaño:', wordBuffer.length, 'bytes');
        
        // 4. Enviar el documento Word directamente (sin convertir a PDF)
        console.log('📤 Enviando documento Word al cliente...');
        
        // Nombre del archivo
        const nombreArchivo = `consentimiento_${pacienteData.nombres_paciente}_${pacienteData.apellidos_paciente}.docx`;
        const nombreSeguro = nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Configurar headers para descarga de Word
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreSeguro}"`);
        res.setHeader('Content-Length', wordBuffer.length);
        
        res.send(wordBuffer);
        console.log('✅ Documento Word enviado exitosamente:', nombreSeguro);
        
    } catch (error) {
        console.error('❌ ===== ERROR EN ENDPOINT =====');
        console.error('❌ Error:', error.message);
        console.error('❌ Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al generar el consentimiento',
            detalle: error.message 
        });
    }
});

app.post('/api/generar-informe-egreso/:id_persona', async (req, res) => {
    console.log('🔔 ===== ENDPOINT LLAMADO =====');
    console.log('📌 Método:', req.method);
    console.log('📌 URL:', req.url);
    console.log('📌 id_persona recibido:', req.params.id_persona);
    
    try {
        const { id_persona } = req.params;
        
        // 1. Obtener datos del paciente por id_persona
        console.log('📋 Buscando datos del paciente...');
        const pacienteData = await obtenerDatosParaEgreso(id_persona);
        console.log('✅ Datos del paciente encontrados:', {
            nombres: pacienteData.nombres_paciente,
            apellidos: pacienteData.apellidos_paciente,
            cedula: pacienteData.cedula_paciente
        });
        
        // 2. Preparar datos para la plantilla
        const templateData = {
            paciente_nombres: pacienteData.nombres_paciente || '',
            paciente_apellidos: pacienteData.apellidos_paciente || '',
            paciente_edad: calcularEdad(pacienteData.fechanac) || 'N/A',
            paciente_cedula: pacienteData.cedula_paciente || '',
            paciente_direccion: pacienteData.direccion || 'No especificada',
            medico_nombres: 'MÉDICO TRATANTE',
            medico_apellidos: '',
            medico_registro: 'N/A',
            diagnostico: 'Enfermedad que requiere oxigenoterapia hiperbárica',
            protocolo: 'Protocolo estándar de oxigenoterapia hiperbárica',
            aceptacion_si: '☑',
            aceptacion_no: '☐',
            fecha_hora: new Date().toLocaleString('es-VE', {
                timeZone: 'America/Caracas',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            medico_firma: 'MÉDICO TRATANTE'
        };
        
        console.log('📄 Datos preparados para plantilla');
        
        // 3. Generar documento Word desde plantilla
        console.log('🔄 Generando documento Word...');
        const wordBuffer = await generarEgresoWord(templateData);
        console.log('✅ Documento Word generado, tamaño:', wordBuffer.length, 'bytes');
        
        // 4. Enviar el documento Word directamente (sin convertir a PDF)
        console.log('📤 Enviando documento Word al cliente...');
        
        // Nombre del archivo
        const nombreArchivo = `consentimiento_${pacienteData.nombres_paciente}_${pacienteData.apellidos_paciente}.docx`;
        const nombreSeguro = nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Configurar headers para descarga de Word
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreSeguro}"`);
        res.setHeader('Content-Length', wordBuffer.length);
        
        res.send(wordBuffer);
        console.log('✅ Documento Word enviado exitosamente:', nombreSeguro);
        
    } catch (error) {
        console.error('❌ ===== ERROR EN ENDPOINT =====');
        console.error('❌ Error:', error.message);
        console.error('❌ Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al generar el consentimiento',
            detalle: error.message 
        });
    }
});

async function obtenerDatosPacientePorId(id_persona) {
    console.log('Buscando datos del paciente por ID:', id_persona);
    
    const query = `
        SELECT 
            p.id_persona,
            p.nombres,
            p.apellidos,
            p.cedula,
            p.tipoci,
            dp.fechanac,
            dp.direccion,
            dp.correo,
            dp.telefono,
            dp.edocivil,
            dp.nivinst,
            dp.profesion
        FROM persona p
        LEFT JOIN datospersonales dp ON p.id_persona = dp.personaid
        WHERE p.id_persona = $1
    `;
    
    const result = await pool.query(query, [id_persona]);
    
    console.log('Resultados encontrados:', result.rows.length);
    
    if (result.rows.length === 0) {
        throw new Error('Paciente no encontrado');
    }
    
    return result.rows[0];
}

// Función para obtener datos para el consentimiento
async function obtenerDatosParaConsentimiento(id_conmed) {
    const query = `
        SELECT 
            cm.id_conmed,
            cm.codconsul,
            cm.tratment,
            pn_paciente.nombres AS nombres_paciente,
            pn_paciente.apellidos AS apellidos_paciente,
            pn_paciente.cedula AS cedula_paciente,
            dp_paciente.fechanac,
            dp_paciente.direccion,
            dp_paciente.correo AS correo_paciente,
            dp_paciente.telefono AS telefono_paciente,
            pn_medico.nombres AS nombres_medico,
            pn_medico.apellidos AS apellidos_medico,
            pn_medico.cedula AS cedula_medico,
            cm.fechaconsul,
            -- Obtener el último protocolo de sesiones
            (
                SELECT protocolo 
                FROM sesiones 
                WHERE id_conmed = cm.id_conmed 
                ORDER BY fecha_sesion DESC 
                LIMIT 1
            ) AS protocolo
            -- Obtener registro médico si existe (ajusta según tu schema)
        FROM consultamedica cm 
        INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
        INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
        INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
        INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
        INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
        WHERE cm.id_conmed = $1
    `;
    
    const result = await pool.query(query, [id_conmed]);
    
    if (result.rows.length === 0) {
        throw new Error('Consulta no encontrada');
    }
    
    return result.rows[0];
}

async function obtenerDatosParaEgreso(id_conmed) {
    const query = `
        SELECT 
            cm.id_conmed,
            cm.codconsul,
            cm.tratment,
            pn_paciente.nombres AS nombres_paciente,
            pn_paciente.apellidos AS apellidos_paciente,
            pn_paciente.cedula AS cedula_paciente,
            dp_paciente.fechanac,
            dp_paciente.direccion,
            dp_paciente.correo AS correo_paciente,
            dp_paciente.telefono AS telefono_paciente,
            pn_medico.nombres AS nombres_medico,
            pn_medico.apellidos AS apellidos_medico,
            pn_medico.cedula AS cedula_medico,
            cm.fechaconsul,
            -- Obtener el último protocolo de sesiones
            (
                SELECT protocolo 
                FROM sesiones 
                WHERE id_conmed = cm.id_conmed 
                ORDER BY fecha_sesion DESC 
                LIMIT 1
            ) AS protocolo
            -- Obtener registro médico si existe (ajusta según tu schema)
        FROM consultamedica cm 
        INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
        INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
        INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
        INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
        INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
        WHERE cm.id_conmed = $1
    `;
    
    const result = await pool.query(query, [id_conmed]);
    
    if (result.rows.length === 0) {
        throw new Error('Consulta no encontrada');
    }
    
    return result.rows[0];
}

// Función para generar el documento Word del consentimiento
async function generarConsentimientoWord(data) {
    try {
        const templatePath = path.join(__dirname, 'uploads', 'plantillas', 'consentimiento_informado.docx');
        
        console.log('📁 Buscando plantilla en:', templatePath);
        console.log('📁 ¿Existe la plantilla?', fs.existsSync(templatePath));
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Plantilla no encontrada en: ${templatePath}`);
        }
        
        // Leer el contenido de la plantilla como BUFFER (no como binary)
        const content = fs.readFileSync(templatePath);
        console.log('✅ Plantilla leída, tamaño:', content.length, 'bytes');
        
        // Usar PizZip correctamente
        let zip;
        try {
            zip = new PizZip(content);
            console.log('✅ Archivo ZIP descomprimido');
        } catch (zipError) {
            console.error('❌ Error al descomprimir el archivo:', zipError);
            throw new Error('La plantilla no es un archivo .docx válido');
        }
        
        // Inicializar docxtemplater
        let doc;
        try {
            doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                nullGetter: () => ''
            });
            console.log('✅ Docxtemplater inicializado');
        } catch (docError) {
            console.error('❌ Error al inicializar docxtemplater:', docError);
            throw new Error('Error al procesar la plantilla Word');
        }
        
        // Renderizar con los datos
        try {
            console.log('📋 Renderizando con datos:', data);
            doc.render(data);
            console.log('✅ Plantilla renderizada correctamente');
        } catch (renderError) {
            console.error('❌ Error al renderizar:', renderError);
            if (renderError.properties) {
                console.error('❌ Detalles del error de renderizado:');
                console.error('- Message:', renderError.properties.message);
                console.error('- Explanation:', renderError.properties.explanation);
                console.error('- File:', renderError.properties.file);
                console.error('- Line:', renderError.properties.line);
                console.error('- Column:', renderError.properties.column);
            }
            throw renderError;
        }
        
        // Generar buffer con opciones específicas
        let buffer;
        try {
            buffer = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
            console.log('✅ Buffer generado, tamaño:', buffer.length, 'bytes');
        } catch (generateError) {
            console.error('❌ Error al generar buffer:', generateError);
            throw generateError;
        }
        
        // Opcional: Guardar para depuración
        const debugPath = path.join(__dirname, 'temp', `debug_${Date.now()}.docx`);
        if (!fs.existsSync(path.dirname(debugPath))) {
            fs.mkdirSync(path.dirname(debugPath), { recursive: true });
        }
        fs.writeFileSync(debugPath, buffer);
        console.log('📁 Archivo de depuración guardado en:', debugPath);
        
        return buffer;
        
    } catch (error) {
        console.error('❌ Error en generarConsentimientoWord:', error);
        throw error;
    }
}

async function generarEgresoWord(data) {
    try {
        const templatePath = path.join(__dirname, 'uploads', 'plantillas', 'informe_egreso.docx');
        
        console.log('📁 Buscando plantilla en:', templatePath);
        console.log('📁 ¿Existe la plantilla?', fs.existsSync(templatePath));
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Plantilla no encontrada en: ${templatePath}`);
        }
        
        // Leer el contenido de la plantilla como BUFFER (no como binary)
        const content = fs.readFileSync(templatePath);
        console.log('✅ Plantilla leída, tamaño:', content.length, 'bytes');
        
        // Usar PizZip correctamente
        let zip;
        try {
            zip = new PizZip(content);
            console.log('✅ Archivo ZIP descomprimido');
        } catch (zipError) {
            console.error('❌ Error al descomprimir el archivo:', zipError);
            throw new Error('La plantilla no es un archivo .docx válido');
        }
        
        // Inicializar docxtemplater
        let doc;
        try {
            doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                nullGetter: () => ''
            });
            console.log('✅ Docxtemplater inicializado');
        } catch (docError) {
            console.error('❌ Error al inicializar docxtemplater:', docError);
            throw new Error('Error al procesar la plantilla Word');
        }
        
        // Renderizar con los datos
        try {
            console.log('📋 Renderizando con datos:', data);
            doc.render(data);
            console.log('✅ Plantilla renderizada correctamente');
        } catch (renderError) {
            console.error('❌ Error al renderizar:', renderError);
            if (renderError.properties) {
                console.error('❌ Detalles del error de renderizado:');
                console.error('- Message:', renderError.properties.message);
                console.error('- Explanation:', renderError.properties.explanation);
                console.error('- File:', renderError.properties.file);
                console.error('- Line:', renderError.properties.line);
                console.error('- Column:', renderError.properties.column);
            }
            throw renderError;
        }
        
        // Generar buffer con opciones específicas
        let buffer;
        try {
            buffer = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
            console.log('✅ Buffer generado, tamaño:', buffer.length, 'bytes');
        } catch (generateError) {
            console.error('❌ Error al generar buffer:', generateError);
            throw generateError;
        }
        
        // Opcional: Guardar para depuración
        const debugPath = path.join(__dirname, 'temp', `debug_${Date.now()}.docx`);
        if (!fs.existsSync(path.dirname(debugPath))) {
            fs.mkdirSync(path.dirname(debugPath), { recursive: true });
        }
        fs.writeFileSync(debugPath, buffer);
        console.log('📁 Archivo de depuración guardado en:', debugPath);
        
        return buffer;
        
    } catch (error) {
        console.error('❌ Error en generarConsentimientoWord:', error);
        throw error;
    }
}

// Función auxiliar para crear plantilla por defecto si no existe
async function crearPlantillaPorDefecto(data) {
    const templatePath = path.join(__dirname, 'plantillas', 'consentimiento_informado.docx');
    
    // Crear un documento Word simple con los placeholders
    const simpleContent = `
        CONSENTIMIENTO INFORMADO PARA OXIGENOTERAPIA HIPERBÁRICA
        
        1. Identificación del paciente/ representante legal.
        
        Nombres y Apellidos del paciente: {paciente_nombres} {paciente_apellidos}
        edad: {paciente_edad} C.I:{paciente_cedula} 
        dirección de domicilio: {paciente_direccion}.
        
        2. Información general y consentimiento:
        
        En mi calidad de paciente y en pleno uso de mis facultades mentales y de
        mis derechos de salud, el Dr.{medico_nombres} {medico_apellidos}
        con registro en MPPS:{medico_registro} del servicio de medicina
        hiperbárica y subacuática, me ha informado en forma confidencial,
        respetuosa, clara y comprensible el diagnostico de mi/ su enfermedad el cual
        es:{diagnostico},
        y de la necesidad de recibir oxigenoterapia hiperbárica en el servicio
        de medicina hiperbárica y subacuática como parte del tratamiento
        complementario a mi diagnostico establecido.
        
        Consiento de manera libre, voluntaria e informada en ser sometido (a) a
        oxigenoterapia hiperbárica, que a continuación se detalla el protocolo a
        emplear: {protocolo}.
        
        Se me ha explicado los beneficios que se esperan de la oxigenoterapia al
        cual me someto...
        
        Lo cual ( SI) {aceptacion_si} o ( NO){aceptacion_no} acepto...
        
        Firma del paciente/ firma del tutor o familiar
        
        C.I: {paciente_cedula}
        
        Fecha y hora: {fecha_hora}
        
        Firma y sello del Médico: {medico_firma}
    `;
    
    // Guardar como archivo temporal
    fs.writeFileSync(templatePath, simpleContent);
    
    // Volver a llamar a la función principal
    return await generarConsentimientoWord(data);
}

// Función para convertir Word a PDF
async function convertirConsentimientoAPDF(wordBuffer) {
    try {
        // Convertir Word a HTML
        const htmlContent = await convertirWordAHTMLConsentimiento(wordBuffer);
        
        // Generar PDF desde HTML
        const pdfBuffer = await generarPDFDesdeHTMLConsentimiento(htmlContent);
        
        return pdfBuffer;
        
    } catch (error) {
        console.error('Error en convertirConsentimientoAPDF:', error);
        throw error;
    }
}

// Convertir Word a HTML usando mammoth
async function convertirWordAHTMLConsentimiento(wordBuffer) {
    // Guardar temporalmente el buffer como archivo
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, `temp_consentimiento_${Date.now()}.docx`);
    
    fs.writeFileSync(tempFilePath, wordBuffer);
    
    try {
        // Convertir a HTML
        const result = await mammoth.convertToHtml({ 
            path: tempFilePath
        });
        
        // Añadir estilos para mantener formato
        const styledHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 12pt;
                        line-height: 1.5;
                        margin: 2cm;
                        color: #000000;
                    }
                    .title {
                        text-align: center;
                        font-weight: bold;
                        font-size: 14pt;
                        margin-bottom: 20px;
                        text-decoration: underline;
                    }
                    .section-title {
                        font-weight: bold;
                        margin-top: 15px;
                        margin-bottom: 10px;
                    }
                    .field {
                        display: inline-block;
                        min-width: 150px;
                        font-weight: bold;
                    }
                    .underline {
                        text-decoration: underline;
                    }
                    .signature-area {
                        margin-top: 100px;
                        padding-top: 20px;
                    }
                    .signature-line {
                        border-top: 1px solid #000;
                        width: 300px;
                        margin-top: 50px;
                    }
                    @media print {
                        body {
                            margin: 1.5cm;
                        }
                        .page-break {
                            page-break-after: always;
                        }
                    }
                </style>
            </head>
            <body>
                ${result.value}
            </body>
            </html>
        `;
        
        return styledHTML;
        
    } finally {
        // Limpiar archivo temporal
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}

// Generar PDF desde HTML con Puppeteer
async function generarPDFDesdeHTMLConsentimiento(htmlContent) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '40px',
                right: '40px',
                bottom: '40px',
                left: '40px'
            },
            printBackground: true,
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });
        
        await browser.close();
        return pdfBuffer;
        
    } catch (error) {
        if (browser) {
            await browser.close();
        }
        throw error;
    }
}

// Función auxiliar para calcular edad
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    
    try {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return `${edad} años`;
    } catch (error) {
        console.error('Error calculando edad:', error);
        return null;
    }
}

// ==================== FUNCIÓN PARA GENERAR DOCUMENTO GENERAL ====================
app.post('/generar-documento/:id_conmed', async (req, res) => {
    try {
        const { id_conmed } = req.params;
        
        // 1. Obtener datos de la consulta médica
        const consultaData = await obtenerDatosConsulta(id_conmed);
        
        // 2. Generar Word con datos
        const wordBuffer = await generarDocumentoWord(consultaData);
        
        // 3. Convertir a PDF
        const pdfBuffer = await convertirWordAPDF(wordBuffer);
        
        // 4. Enviar al cliente
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="consulta_${id_conmed}.pdf"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al generar documento' });
    }
});

// Mantén las funciones originales para generar-documento aquí...
async function obtenerDatosConsulta(id_conmed) {
    // Tu implementación original
}

async function generarDocumentoWord(consultaData) {
    // Tu implementación original
}

async function convertirWordAPDF(wordBuffer) {
    // Tu implementación original
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

app.post('/api/updateConsulta', async (req, res) => {
    const { id_conmed } = req.body;

    try {
        const result = await pool.query(
            'UPDATE consultamedica SET status = false WHERE id_conmed = $1',
            [id_conmed]
        );

        res.status(201).json({
            success: true,
            message: 'Consulta Inhabilitada',
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
    const { ci, pacienteId, firstname, lastname, codconsul, fechaConsul, motivo, sesiones, tratment, medicoid, status } = req.body;
    const medvint= parseInt(medicoid);
    try {
        const result = await pool.query(
            'INSERT INTO consultamedica (pacienteid, codconsul, motivo, cant_sesions, tratment, medicoid, fechaconsul, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [pacienteId, codconsul, motivo, sesiones, tratment, medvint, fechaConsul, status]
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

// Backend: endpoint para insertar examen físico (CORREGIDO PARA POSTGRESQL)
app.post('/api/examen-fisico', async (req, res) => {
    try {
        const {
            pacienteId,
            usuario_registro,
            // Campos del formulario
            piel,
            cabeza,
            ojos,
            oido,
            nariz,
            boca,
            faringe,
            cuello,
            glinfaticos,
            torax,
            senos,
            pulmones,
            corazon,
            vsanguineos,
            abdomen,
            genitales,
            recto,
            extremidades,
            observaciones
        } = req.body;

        // Validación básica
        if (!pacienteId) {
            return res.status(400).json({
                success: false,
                message: 'Código de paciente y usuario son requeridos'
            });
        }

        // Query para insertar el examen físico (CORREGIDO - PostgreSQL usa $1, $2...)
        const query = `
            INSERT INTO examenes_fisicos 
            (
                codigo_paciente, usuario_registro,
                piel, cabeza, ojos, oido, nariz, boca,
                faringe, cuello, glinfaticos, torax,
                senos, pulmones, corazon, vsanguineos,
                abdomen, genitales, recto, extremidades,
                observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING id_examen, fecha_registro
        `;

        const result = await pool.query(query, [
            pacienteId,
            usuario_registro,
            piel || null,
            cabeza || null,
            ojos || null,
            oido || null,
            nariz || null,
            boca || null,
            faringe || null,
            cuello || null,
            glinfaticos || null,
            torax || null,
            senos || null,
            pulmones || null,
            corazon || null,
            vsanguineos || null,
            abdomen || null,
            genitales || null,
            recto || null,
            extremidades || null,
            observaciones || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Examen físico registrado correctamente',
            data: {
                id_examen: result.rows[0].id_examen,
                // pacienteId,
                fecha_registro: result.rows[0].fecha_registro
            }
        });

    } catch (error) {
        console.error('Error al registrar examen físico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el examen físico',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Endpoint para obtener exámenes físicos de un paciente
app.get('/api/examenes-fisicos/:codigo_paciente', async (req, res) => {
    try {
        const { codigo_paciente } = req.params;
        
        const query = `
            SELECT * FROM examenes_fisicos 
            WHERE codigo_paciente = $1 
            AND estado_registro = 'ACTIVO'
            ORDER BY fecha_registro DESC
        `;
        
        const result = await pool.query(query, [codigo_paciente]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error al obtener exámenes físicos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener exámenes físicos'
        });
    }
});

// Endpoint para obtener un examen físico específico
app.get('/api/examen-fisico/:id_examen', async (req, res) => {
    try {
        const { id_examen } = req.params;
        
        const query = `
            SELECT * FROM examenes_fisicos 
            WHERE id_examen = $1 
            AND estado_registro = 'ACTIVO'
        `;
        
        const result = await pool.query(query, [id_examen]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Examen físico no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error al obtener examen físico:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener examen físico'
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

app.post('/api/regSesion', async (req, res) => {
    const { id_conmed,
        fecha_avance,
        protocolo,
        tiempo_protocolo,
        parterial_before,
        estatura_before,
        peso_before,
        saturacion_before,
        pulso_before,
        frespiratoria_before,
        estatura_after,
        parterial_after,
        peso_after,
        saturacion_after,
        pulso_after,
        frespiratoria_after } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO sesiones
                (id_conmed,
                protocolo,
                tiempo_protocolo,
                proxima_sesion,
                parterial_before,
                estatura_before,
                peso_before,
                saturacion_before,
                pulso_before,
                frespiratoria_before,
                parterial_after,
                estatura_after,
                peso_after,
                saturacion_after,
                pulso_after,
                frespiratoria_after)
	        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [id_conmed, protocolo, tiempo_protocolo, fecha_avance, parterial_before, estatura_before, peso_before, saturacion_before, pulso_before, frespiratoria_before, parterial_after, estatura_after, peso_after, saturacion_after, pulso_after, frespiratoria_after]
        );
        res.status(201).json({
            success: true,
            message: "Sesion registrada exitosamente",
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

app.post('/api/regInasistencia', async (req, res) => {
    const { id_conmed, fechaInasis } = req.body;

    try {
        const response = await pool.query(
            'INSERT INTO inasistencias (id_conmed, fecha_inasistencia) VALUES ($1, $2) RETURNING *',
            [id_conmed, fechaInasis]
        );
        res.status(201).json({
            success:true,
            message: "Inasistencia Registrada",
            data: response.rows[0]
        });
    } catch (err) {
        console.log('El error es: ', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.get('/api/inasistenciasPerConsulta/:id_conmed', async (req, res) => {
    const { id_conmed } = req.params;

    try {
        const response = await pool.query(
            `SELECT
                COUNT(*) AS total_inasistencias,
	            MAX(fecha_inasistencia) AS ultima_inasistencia
            FROM inasistencias
            WHERE id_conmed = $1`,
            [id_conmed]
        );

        if (response.rows.length > 0) {
            res.json(response.rows[0]);
        } else {
            res.json({});
        }
    } catch(error) {
        console.log("El error es: ", error)
        res.status(500).json({
            success: false,
            message: `Error al contar las inasistencias: ${error.message}`,
        });
    }
});

app.post('/api/regRol', async (req, res) => {
    const { nrol, status, descript } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO avance_consultas (nrol, status, descript) VALUES ($1, $2, $3) RETURNING *',
            [nrol, status, descript]
        );
        res.status(201).json({
            success: true,
            message: "Rol registrado exitosamente",
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

app.get('/api/roles', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id_rol, nrol, status, descript FROM roles');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(501).send('Error al obtener los roles');
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

app.get('/api/avancesConsultas/:id_conmed', async (req, res) => {
    const { id_conmed } = req.params;
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
              pn_medico.tipoci AS tipoci_medico,
              pn_medico.cedula AS cedula_medico,
              cm.fechaingreso AS fecha_ingreso,
              cm.diagnostic AS diagnostic,
              cm.tratment AS tratment,
              cm.status AS status,
              acm.tiempo_tratamiento,
              acm.fecha_avance AS fecha_avance,
              acm.estado_paciente AS estado_paciente,
              acm.diagnostico AS diagnostico_avance,
              acm.fecha_registro AS fecha_registro
          FROM consultamedica cm 
              INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
              INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
              INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
              INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
              INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
              LEFT JOIN avance_consultas acm ON acm.id_conmed = cm.id_conmed
          WHERE cm.id_conmed = $1;
      `, [id_conmed]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(501).send('Error al obtener los datos');
    }
});

app.get('/api/sesiones/:id_conmed', async (req, res) => {
    const { id_conmed } = req.params;
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
              pn_medico.tipoci AS tipoci_medico,
              pn_medico.cedula AS cedula_medico,
              cm.fechaingreso AS fecha_ingreso,
              cm.cant_sesions AS sesiones,
              cm.tratment AS tratment,
              cm.status AS status,
              ses.protocolo AS protocolo,
			  ses.tiempo_protocolo AS tiempo_protocolo,
			  ses.proxima_sesion AS proxima_sesion,
			  ses.parterial_before AS parterial_before,
			  ses.estatura_before AS estatura_before,
			  ses.peso_before AS peso_before,
			  ses.saturacion_before AS saturacion_before,
			  ses.pulso_before AS pulso_before,
			  ses.frespiratoria_before AS frespiratoria_before,
			  ses.parterial_after AS parterial_after,
			  ses.estatura_after AS estatura_after,
			  ses.peso_after AS peso_after,
			  ses.saturacion_after AS saturacion_after,
			  ses.pulso_after AS pulso_after,
			  ses.frespiratoria_after AS frespiratoria_after,
			  ses.fecha_sesion AS fecha_sesion
          FROM consultamedica cm
              INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
              INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
              INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
              INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
              INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
              LEFT JOIN sesiones ses ON ses.id_conmed = cm.id_conmed
          WHERE cm.id_conmed = $1;
      `, [id_conmed]);
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
            cm.cant_sesions AS sesiones,
            cm.tratment AS tratment,
            cm.status AS status
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

app.get('/api/dashboardProgressPacientes', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                cm.id_conmed,
                pn_paciente.nombres AS nombres_paciente,
                pn_paciente.apellidos AS apellidos_paciente, 
                pn_paciente.cedula AS cedula_paciente,
                pn_medico.nombres AS nombres_medico,
                pn_medico.apellidos AS apellidos_medico,
                pn_medico.tipoci AS tipoci_medico,
                pn_medico.cedula AS cedula_medico,
                cm.cant_sesions AS sesiones_planificadas,
                cm.status AS status,
                -- Obtener la última próxima sesión
                ultima_sesion.proxima_sesion AS ultima_proxima_cita,
                ultima_sesion.fecha_sesion AS ultima_fecha_sesion,
                -- Contar el total de sesiones realizadas
                (
                    SELECT COUNT(*) 
                    FROM sesiones s 
                    WHERE s.id_conmed = cm.id_conmed
                ) AS total_sesiones_realizadas
            FROM consultamedica cm 
                INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
                INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
                INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
                INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
                INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
                LEFT JOIN LATERAL (
                    SELECT 
                        proxima_sesion,
                        fecha_sesion
                    FROM sesiones s
                    WHERE s.id_conmed = cm.id_conmed
                    ORDER BY s.fecha_sesion DESC NULLS LAST
                    LIMIT 1
                ) AS ultima_sesion ON true;
            `);
        res.json(rows);
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
            pn_medico.tipoci AS tipoci_medico,
            pn_medico.cedula AS cedula_medico,
            cm.fechaingreso AS fecha_ingreso,
            cm.cant_sesions AS sesiones,
            cm.tratment AS tratment,
            cm.status AS status,
            -- Obtener la última próxima sesión
            ultima_sesion.proxima_sesion AS ultima_proxima_cita,
            ultima_sesion.fecha_sesion AS ultima_fecha_sesion
        FROM consultamedica cm 
            INNER JOIN paciente p ON cm.pacienteid = p.id_paciente 
            INNER JOIN datospersonales dp_paciente ON p.dpersonalesid = dp_paciente.id_dpersonales 
            INNER JOIN persona pn_paciente ON dp_paciente.personaid = pn_paciente.id_persona
            INNER JOIN usuarios u ON cm.medicoid = u.id_usuario
            INNER JOIN persona pn_medico ON u.id_persona = pn_medico.id_persona
            LEFT JOIN LATERAL (
                SELECT 
                    proxima_sesion,
                    fecha_sesion
                FROM sesiones s
                WHERE s.id_conmed = cm.id_conmed
                ORDER BY s.fecha_sesion DESC NULLS LAST
                LIMIT 1
            ) AS ultima_sesion ON true;
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