const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const {
        title,
        url,
        description
    } = req.body;

    const newLink = {
        title,
        url,
        description
    };

    await pool.query('INSERT INTO links SET ?', [newLink]);
    res.send('received');
});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM database_GFact.links;');
    res.render('links/list');
});

module.exports = router;