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
        email
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

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);

    res.render('links/edit', {
        link: links[0]
    });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;

    const {
        title,
        description,
        url
    } = req.body;

    const newLink = {
        title,
        description,
        url
    };

    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);

    req.flash('success', 'Link actualizado');
    res.redirect('/links');
});

module.exports = router;