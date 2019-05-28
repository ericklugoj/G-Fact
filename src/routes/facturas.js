const express = require('express');
const router = express.Router();
const path = require('path');

const pool = require('../database');
const {
    isLoggedIn
} = require('../lib/auth');

// Modificar esta ruta para visualizar las facturas
router.get('/', isLoggedIn, async (req, res) => {
    const facturas = await pool.query('SELECT * FROM facturas');
    res.render('facturas/listar', {
        facturas
    });
});

router.get('/individual', isLoggedIn, async (req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados ORDER BY nombres ASC');
    res.render('facturas/individual', {
        empleados
    });
});

router.post('/getEmpleado', isLoggedIn, async (req, res) => {
    const {
        id_empleado
    } = req.body;
    const empleado = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id_empleado]);

    res.send(empleado);
});

router.get('/correo/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    const factura = await pool.query('SELECT * FROM facturas WHERE id_facturas = ?', [id]);
    const ruta_pdf_correo = path.join(__dirname, '..', 'public', 'public', factura[0].ruta_pdf);

    // Re enviar correo
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ericklugoj@gmail.com',
            pass: 'ihfwedsdrqykcsix'
        }
    });

    var mailOptions = {
        from: 'ericklugoj@gmail.com',
        to: factura[0].email,
        subject: '[G-FACT] Recibo de nomina (Re enviado)',
        text: `Hola ${factura[0].nombre_completo_empleado} este correo tiene adjunto `,
        attachments: [{
            path: ruta_pdf_correo
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    req.flash('success', 'Correo re enviado');
    res.redirect('/facturas');
});

router.post('/facturar', isLoggedIn, async (req, res) => {
    const {
        id_empleado,
        nombre_completo_empleado,
        sueldo_diario,
        inicio_periodo,
        fin_periodo,
        otros_pagos,
        faltas,
        retardos,
        correo
    } = req.body;

    var d1 = new Date(inicio_periodo);
    var d2 = new Date(fin_periodo);
    var tiempoDiferencia = d2.getTime() - d1.getTime();
    var diasTrabajados = (tiempoDiferencia / (1000 * 3600 * 24)) + 1;

    // Convertir variables de string a numeros
    var aux_diasTrabajados = diasTrabajados != '' ? parseInt(diasTrabajados, 10) : 0;
    var aux_otrosPagos = otros_pagos != '' ? parseInt(otros_pagos, 10) : 0;
    var aux_faltas = faltas != '' ? parseInt(faltas, 10) : 0;
    var aux_retardos = retardos != '' ? parseInt(retardos, 10) : 0;

    // Calcular sueldo neto
    var sueldo_neto = (((sueldo_diario * aux_diasTrabajados) + (aux_otrosPagos)) - (aux_faltas + aux_retardos));

    // Crear PDF
    var pdf = require('html-pdf');
    var varDate = new Date();
    varDate = varDate.toDateString();
    var ruta_archivo_pdf = path.join(__dirname, '..', 'public', 'pdf', nombre_completo_empleado, 'FACTURA_NOMINA_' + varDate + '.pdf');

    var contenido = `
    <table>
    <tr style="background: black; color: white">
        <th>Name</th>
        <th colspan="2">Telephone</th>
    </tr>
    <tr>
        <td>Bill Gates</td>
        <td>55577854</td>
        <td>55577855</td>
    </tr>
    </table>
    `;

    pdf.create(contenido).toFile(ruta_archivo_pdf, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    // Enviar Mail
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ericklugoj@gmail.com',
            pass: 'ihfwedsdrqykcsix'
        }
    });

    var mailOptions = {
        from: 'ericklugoj@gmail.com',
        to: correo,
        subject: '[G-FACT] Recibo de nomina',
        text: `Hola ${nombre_completo_empleado} aqui esta tu nomina en formato PDF`,
        attachments: [{
            path: ruta_archivo_pdf
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    let ruta_directa_pdf = path.join('..', 'pdf', nombre_completo_empleado, 'FACTURA_NOMINA_' + varDate + '.pdf');

    const nuevaFactura = {
        id_empleado,
        sueldo_diario,
        ruta_pdf: ruta_directa_pdf,
        ruta_xml: 'var/prebas.xml',
        fecha_timbrado: new Date(),
        nombre_completo_empleado,
        monto_total: sueldo_neto,
        email: correo,
        otros_pagos: otros_pagos != '' ? otros_pagos : 0,
        faltas: faltas != '' ? faltas : 0,
        retardos: retardos != '' ? retardos : 0,
        inicio_periodo,
        fin_periodo
    };

    await pool.query('INSERT INTO facturas SET ?', [nuevaFactura]);
    // Mensajes
    req.flash('success', 'Factura timbrada y enviada');
    res.redirect('/facturas');
});

module.exports = router;