const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {User} = require("./src/models/models");

mongoose.connect('mongodb://localhost:27017/PDC')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB...', err));

const usuariosFicticios = [
    { nombre: 'Juan', apellidos: 'Pérez López', dni: '12345678Z', email: 'juan.perez@example.com', password: '11223344', role: 'user' },
    { nombre: 'María', apellidos: 'Gómez Raul', dni: '23456789D', email: 'maria.gomez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Carlos', apellidos: 'Rodríguez Lugo', dni: '34567890V', email: 'carlos.rodriguez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Ana', apellidos: 'Martínez Suárez', dni: '45678901G', email: 'ana.martinez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Pedro', apellidos: 'Sánchez Castejón', dni: '56789012B', email: 'pedro.sanchez@example.com', password: '11223344', role: 'user' }
];

async function insertarUsuariosFicticios() {
    await Promise.all(usuariosFicticios.map(async usuario => {
        const hashedPassword = await bcrypt.hash(usuario.password, 10);
        const newUser = new User({
            dni: usuario.dni,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            password: hashedPassword,
            role: usuario.role
        });
        try {
            await newUser.save();
            console.log(`Usuario ${usuario.nombre} ${usuario.apellidos} insertado correctamente.`);
        } catch (error) {
            console.error(`Error al insertar el usuario ${usuario.nombre} ${usuario.apellidos}:`, error);
        }
    }));
}

// Ejecutar la función para insertar los usuarios
insertarUsuariosFicticios().then(() => console.log('Todos los usuarios ficticios han sido insertados.'));
