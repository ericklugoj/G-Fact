const express = require('express');
const router = express.Router();

const pool = require('../database');

const passport = require('passport');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, async (req, res) => {
    const num_empleados = await pool.query('SELECT COUNT(*) AS total FROM empleados');
    const num_facturas = await pool.query('SELECT COUNT(*) AS total FROM facturas');
    res.render('profile', {
        empleados: num_empleados[0],
        facturas: num_facturas[0]
    });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;