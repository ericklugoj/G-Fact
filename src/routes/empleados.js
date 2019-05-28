const express = require('express');
const router = express.Router();

const pool = require('../database');
const {
    isLoggedIn
} = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    let empleados = await pool.query('SELECT * FROM empleados');
    empleados.forEach(empleado => {
        var f = new Date(empleado.fecha_nacimiento);
        var f2 = new Date(empleado.fecha_ingreso);
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

        empleado.fecha_nacimiento = (f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
        empleado.fecha_ingreso = (f2.getDate() + " de " + meses[f2.getMonth()] + " de " + f2.getFullYear());

    });
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

    empleados.forEach(empleado => {
        var f = new Date(empleado.fecha_nacimiento);
        var f2 = new Date(empleado.fecha_ingreso);



        empleado.fecha_nacimiento = (f.getFullYear() + "-0" + f.getMonth() + "-0" + f.getDate());
        empleado.fecha_ingreso = (f2.getFullYear() + "-0" + f2.getMonth() + "-0" + f2.getDate());

    });
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