const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');

function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Acceso denegado. No se proporcionó token.');

    try {
        req.user = jwt.verify(token, 'secretKey');
        next();
    } catch (error) {
        res.status(400).send('Token inválido.');
    }
}

mongoose.connect('mongodb://localhost:27017/PDC')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB...', err));

const userSchema = Joi.object({
    dni: Joi.string().required(),
    nombre: Joi.string().required(),
    apellidos: Joi.string().required(),
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
    dni: {type: String, required: true, unique: true},
    nombre: {type: String, required: true},
    apellidos: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const aportacionSchemaMongo = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    promotor: {type: String, required: true},
    entidadFinanciera: {type: String, required: true},
    cantidadTotalAportacionesMensuales: {type: Number, required: true},
    aportacionesMensuales: {type: Number, required: true},
    fechaProcesamiento: {type: Date, required: true},
    estado: {type: String, required: true}
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

app.post('/api/register', async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.error("error: " + error.details[0].message)
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.dni || req.body.email});
    if (user) {
        console.error('El usuario ya existe.')
        return res.status(400).send('El usuario ya existe.');
    }

    user = new User({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
        const token = jwt.sign({ _id: user._id }, 'clave-macro-secreta', { expiresIn: '24h' });
        res.send({ token });
    } catch (error) {
        res.status(500).send("Error al guardar el usuario: " + error.message);
    }
});

app.post('/api/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Usuario o contraseña incorrectos.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Usuario o contraseña incorrectos.');

    const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '24h' }); // Reemplaza 'secretKey' con tu clave secreta
    res.send({ token });
});


app.post('/api/cargar-informacion', async (req, res) => {
    const {error, value} = aportacionSchema.validate(req.body);

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
