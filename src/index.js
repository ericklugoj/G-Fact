const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');

const {
    database
} = require('./keys');

// Inicializacion
const app = express();
require('./lib/passport');

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares (funciones que se ejecutan con cada peticion)
app.use(session({
    secret: 'lugoserver',
    resave: false, // no se renueve la sesion
    saveUninitialized: false, // no se vuelva a establecer la sesion
    store: new MySqlStore(database) // donde se guarda la sesion
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/empleados', require('./routes/empleados'));
app.use('/facturas', require('./routes/facturas'));

// Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log('Server iniciado en puerto:', app.get('port'));
});