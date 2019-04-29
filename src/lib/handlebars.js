const {
    format
} = require('timeago.js');

const {
    date
} = require('handlebars-helpers');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.formatter = (fecha) => {
    return date(fecha);
};

module.exports = helpers;