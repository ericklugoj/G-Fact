const express = require('express');
const router = express.Router();

const pool = require('../database');
const {
    isLoggedIn
} = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados');
    res.render('empleados/listar', {
        empleados
    });
});

router.get('/agregar', isLoggedIn, (req, res) => {
    res.render('empleados/agregar');
});

router.post('/agregar', isLoggedIn, async (req, res) => {
    const {
        nombres,
        apellidos,
        fecha_nacimiento,
        sexo,
        rfc,
        curp,
        seguro_social,
        departamento,
        puesto,
        fecha_ingreso,
        direccion,
        telefono,
        email,
        sueldo_diario
    } = req.body;

    const nuevoEmpleado = {
        nombres,
        apellidos,
        fecha_nacimiento,
        sexo,
        rfc,
        curp,
        seguro_social,
        departamento,
        puesto,
        fecha_ingreso,
        direccion,
        telefono,
        email,
        sueldo_diario,
        fecha_registro: new Date()
    };

    await pool.query('INSERT INTO empleados SET ?', [nuevoEmpleado]);
    //mensajes
    req.flash('success', 'Empleado dado de alta correctamente');
    res.redirect('/empleados');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link eliminado');
    res.redirect('/links');
});

router.get('/editar/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    const empleados = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
    res.render('empleados/editar', {
        empleado: empleados[0]
    });
});

router.post('/editar/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    const {
        nombres,
        apellidos,
        fecha_nacimiento,
        sexo,
        rfc,
        curp,
        seguro_social,
        departamento,
        puesto,
        fecha_ingreso,
        direccion,
        telefono,
        email,
        sueldo_diario
    } = req.body;

    const nuevoEmpleado = {
        nombres,
        apellidos,
        fecha_nacimiento,
        sexo,
        rfc,
        curp,
        seguro_social,
        departamento,
        puesto,
        fecha_ingreso,
        direccion,
        telefono,
        email,
        sueldo_diario
    };

    await pool.query('UPDATE empleados SET ? WHERE id_empleado = ?', [nuevoEmpleado, id]);

    req.flash('success', 'Empleado actualizado');
    res.redirect('/empleados');
});

module.exports = router;