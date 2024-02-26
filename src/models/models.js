const mongoose = require('mongoose');

const userSchemaMongo = new mongoose.Schema({
    dni: {type: String, required: true, unique: true},
    nombre: {type: String, required: true},
    apellidos: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'user'}
});

const EntidadSchemaMongo = new mongoose.Schema({
    nombre: {type: String, required: true},
    NIF: {type: String, required: true},
    codigo: {type: String, required: true},
    direccion: {type: String, required: true},
    telefono: {type: String, required: true},
    email: {type: String, required: true},
    sitioWeb: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'entidad'}
});

const aportacionSchemaMongo = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellidos: {type: String, required: true},
    promotor: {type: String, required: true},
    entidadFinanciera: {type: String, required: true},
    cantidadTotal: {type: Number, required: true},
    mes: {type: String, required: true},
    aportacionesMensuales: {type: Number, required: true},
    fechaProcesamiento: {type: Date, required: true},
    estado: {type: String, required: true}
});

module.exports.User = mongoose.model('User', userSchemaMongo, 'users');
module.exports.Entidad = mongoose.model('Entidad', EntidadSchemaMongo, 'entidades');
module.exports.Aportacion = mongoose.model('Aportacion', aportacionSchemaMongo, 'aportaciones');
