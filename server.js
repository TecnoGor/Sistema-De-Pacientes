const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '10.16.12.50',
  database: 'db_ipostel_2025',
  password: 'postgres',
  port: 5432,
});

// Ruta para obtener los datos de la base de datos
app.get('/api/data', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT codper, cedper, nomper, apeper, carantper, codger FROM sno_personal');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los datos');
  }
});

app.get('/empleado/:ced', async (req, res) => {
  const { ced } = req.params;

  try {
    const result = await pool.query('SELECT DISTINCT p.cedper, p.nacper, p.fecingper, p.nomper, p.apeper, pn.sueper, ac.denasicar, c.descar , u.desuniadm, pn.codnom,ptc.dentippersss, trim(g.denger) as denger, n.codnom, n.peractnom FROM sno_personal p INNER JOIN sno_hnomina n on  n.peractnom in (select max(codperi) from sno_hperiodo where codnom = n.codnom and numpernom = 24 or numpernom = 52) INNER JOIN sno_hpersonalnomina pn  on p.codper = pn.codper and pn.codnom = n.codnom	and pn.staper in (1, 2) AND pn.codperi = n.peractnom LEFT JOIN sno_hasignacioncargo ac on n.codemp = ac.codemp AND n.codnom = ac.codnom AND pn.codasicar = ac.codasicar AND ac.codperi = n.peractnom LEFT JOIN sno_hunidadadmin u on u.minorguniadm = pn.minorguniadm and u.ofiuniadm = pn.ofiuniadm and u.uniuniadm = pn.uniuniadm and u.depuniadm = pn.depuniadm and u.prouniadm = pn.prouniadm AND u.codperi = n.peractnom and u.codnom = pn.codnom LEFT JOIN srh_gerencia g on g.codger = p.codger LEFT JOIN sno_hcargo c on pn.codemp = c.codemp AND pn.codnom = c.codnom AND pn.codcar = c.codcar AND c.codperi = n.peractnom LEFT JOIN sno_hasignacioncargo a on a.codasicar = pn.codasicar and a.codnom = pn.codnom AND a.codperi = n.peractnom INNER JOIN sno_tipopersonalsss ptc on p.codtippersss = ptc.codtippersss AND pn.staper in (1, 2) LEFT JOIN sno_concepto conc ON conc.codnom = n.codnom LEFT JOIN sno_hconceptopersonal cp ON cp.codemp=pn.codemp AND cp.codper=pn.codper AND cp.codnom=pn.codnom AND  cp.aplcon = 1 AND cp.codperi = n.peractnom and cp.codconc = conc.codconc LEFT JOIN sno_hsalida csal ON csal.codemp = pn.codemp AND csal.codper = pn.codper AND csal.tipsal = A AND csal.codperi = n.peractnom AND csal.codconc = conc.codconc WHERE p.cedper = $1', [ced]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Empleado no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar la base de datos.');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});