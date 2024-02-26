const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Acceso denegado. No se proporcionó token.');

    try {
        req.user = jwt.verify(token, 'clave-macro-secreta');
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
    cantidadTotal: Joi.number().required(),
    mes: Joi.string().required(),
    aportacionesMensuales: Joi.number().required()
});

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
    apellido: {type: String, required: true},
    promotor: {type: String, required: true},
    entidadFinanciera: {type: String, required: true},
    cantidadTotal: {type: Number, required: true},
    mes: {type: String, required: true},
    aportacionesMensuales: {type: Number, required: true},
    fechaProcesamiento: {type: Date, required: true},
    estado: {type: String, required: true, default: 'procesada'}
});

const User = mongoose.model('User', userSchemaMongo, 'users');
const Entidad = mongoose.model('Entidad', EntidadSchemaMongo, 'entidades');
const Aportacion = mongoose.model('Aportacion', aportacionSchemaMongo, 'aportaciones');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Servidor Express funcionando!');
});

app.get('/acceso-denegado', (req, res) => {
    res.status(401).send('Acceso denegado');
});

app.post('/api/register', async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.error("error: " + error.details[0].message)
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ dni: req.body.dni || req.body.email}, null, null);
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
    const {dni, password} = req.body;

    let account = await User.findOne({ dni: dni.toUpperCase() }, null, null);

    let payload = {};

    if (!account) {
        account = await Entidad.findOne({ NIF: dni.toUpperCase() }, null, null);
        if (!account) return res.status(400).send('DNI/NIF o contraseña incorrectos.');
        payload = {
            nombre: account.nombre,
            NIF: account.NIF,
            codigo: account.codigo,
            direccion: account.direccion,
            telefono: account.telefono,
            email: account.email,
            sitioWeb: account.sitioWeb,
            role: account.role
        }
    }else {
         payload = {
            id: account.dni,
             nombre: account.nombre,
             apellidos: account.apellidos,
             email: account.email,
             role: account.role
        }
    }

    const validPassword = await bcrypt.compare(password, account.password);
    if (!validPassword) return res.status(400).send('DNI/NIF o contraseña incorrectos.');

    const token = jwt.sign(payload, 'clave-macro-secreta', { expiresIn: '24h' });
    res.send({ token });
});

app.post('/api/cargar-informacion', upload.single('file'), (req, res) => {
    let results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            results = results.map((result) => {
                const { error } = aportacionSchema.validate(result);
                if (error) {
                    console.error("error: " + error.details[0].message)
                    return res.status(400).send(error.details[0].message);
                }
                return {
                    nombre: result.nombre,
                    apellido: result.apellido,
                    promotor: result.promotor,
                    entidadFinanciera: result.entidadFinanciera,
                    cantidadTotal: result.cantidadTotal,
                    mes: result.mes,
                    aportacionesMensuales: result.aportacionesMensuales,
                    fechaProcesamiento: new Date()
                };
            });
            Aportacion.insertMany(results)
                .then(() => {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Error al eliminar el archivo temporal:', err);
                        res.send('Archivo procesado con éxito y datos almacenados.');
                    });
                })
                .catch((error) => {
                    res.status(500).send('Error al almacenar los datos: ' + error.message);
                });
        });
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
