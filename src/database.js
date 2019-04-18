const mysql = require('mysql');
const {
    promisify
} = require('util');

const {
    database
} = require('./keys');

//Conexion a la BD
const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexión a la base de datos fue cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene muchas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión a la base de datos fue rechazada');
        }
    }

    if (connection) connection.release();
    console.log('Base de datos conectada');

    return;
});

// Conviertiendo callbacks en promesas
pool.query = promisify(pool.query);

module.exports = pool;