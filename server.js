const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');

mongoose.connect('mongodb://localhost:27017/PDC', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB...', err));

const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const aportacionSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    promotor: Joi.string().required(),
    entidadFinanciera: Joi.string().required(),
    cantidadTotalAportacionesMensuales: Joi.number().required(),
    aportacionesMensuales: Joi.number().required()
});

const userSchemaMongo = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const aportacionSchemaMongo = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    promotor: { type: String, required: true },
    entidadFinanciera: { type: String, required: true },
    cantidadTotalAportacionesMensuales: { type: Number, required: true },
    aportacionesMensuales: { type: Number, required: true },
    fechaProcesamiento: { type: Date, required: true },
    estado: { type: String, required: true }
});

const User = mongoose.model('User', userSchemaMongo, 'users');
const Aportacion = mongoose.model('Aportacion', aportacionSchemaMongo, 'carga-informacion');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Servidor Express funcionando!');
});

// Ruta de Registro
app.post('/api/register', async (req, res) => {
    // Lógica de registro
});

// Ruta de Autenticación
app.post('/api/login', async (req, res) => {
    // Lógica de autenticación
});

app.post('/api/cargar-informacion', async (req, res) => {
    const { error, value } = aportacionSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const datosProcesados = {
        ...value,
        fechaProcesamiento: new Date(),
        estado: "procesado"
    };

    const aportacion = new Aportacion({
        nombre: datosProcesados.nombre,
        apellido: datosProcesados.apellido,
        promotor: datosProcesados.promotor,
        entidadFinanciera: datosProcesados.entidadFinanciera,
        cantidadTotalAportacionesMensuales: datosProcesados.cantidadTotalAportacionesMensuales,
        aportacionesMensuales: datosProcesados.aportacionesMensuales,
        fechaProcesamiento: datosProcesados.fechaProcesamiento,
        estado: datosProcesados.estado
    });

    try {
        const resultado = await aportacion.save();
        res.send(resultado);
    } catch (error) {
        res.status(500).send("Error al guardar los datos: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
