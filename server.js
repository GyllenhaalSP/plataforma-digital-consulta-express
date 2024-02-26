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
const {User, Aportacion, Entidad} = require("./src/models/models");

const upload = multer({ dest: 'uploads/' });

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
    apellidos: Joi.string().required(),
    promotor: Joi.string().required(),
    entidadFinanciera: Joi.string().required(),
    cantidadTotal: Joi.number().required(),
    mes: Joi.string().required(),
    aportacionesMensuales: Joi.number().required()
});

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

app.get('/api/entidades/:nombreEntidad', async (req, res) => {
    const nombreEntidad = req.params.nombreEntidad;

    try {
        const aportaciones = await Aportacion.find({ entidadFinanciera: nombreEntidad }, null, null);
        res.json(aportaciones);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener las aportaciones", error: error.message });
    }
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
    fs.createReadStream(req.file.path, { encoding: 'utf-8' })
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const validationErrors = results.map((result) => aportacionSchema.validate(result))
                .filter((validationResult) => validationResult.error != null)
                .map((validationResult) => validationResult.error.details[0].message);

            if (validationErrors.length > 0) {
                return res.status(400).send({ errors: validationErrors });
            }

            const aportacionesToInsert = results.map((result) => ({
                nombre: result.nombre,
                apellidos: result.apellidos,
                promotor: result.promotor,
                entidadFinanciera: result.entidadFinanciera,
                cantidadTotal: result.cantidadTotal,
                mes: result.mes,
                aportacionesMensuales: result.aportacionesMensuales,
                fechaProcesamiento: new Date(),
                estado: "procesada"
            }));

            Aportacion.insertMany(aportacionesToInsert)
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
