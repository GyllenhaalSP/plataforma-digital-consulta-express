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
    { nombre: 'Pedro', apellidos: 'Sánchez Castejón', dni: '56789012B', email: 'pedro.sanchez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Miguel', apellidos: 'Álvarez Fernández', dni: '68112997S', email: 'miguel.álvarez@example.com', password: '11223344', role: 'user'},
    { nombre: 'Roberto', apellidos: 'Fernández Gómez', dni: '51721913L', email: 'roberto.fernández@example.com', password: '11223344', role: 'user' },
    { nombre: 'Ana', apellidos: 'Romero Martínez', dni: '53747457E', email: 'ana.romero@example.com', password: '11223344', role: 'user' },
    { nombre: 'Jorge', apellidos: 'Gutierrez Diaz', dni: '95435668C', email: 'jorge.gutierrez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Marta', apellidos: 'Pérez Castillo', dni: '56035223R', email: 'marta.pérez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Laura', apellidos: 'García Martínez', dni: '56286811S', email: 'laura.garcía@example.com', password: '11223344', role: 'user' },
    { nombre: 'Marcos', apellidos: 'Benítez Lozano', dni: '31222229M', email: 'marcos.benítez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Elena', apellidos: 'Sánchez Ruiz', dni: '30271147L', email: 'elena.sánchez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Javier', apellidos: 'Barbero García', dni: '56571112J', email: 'javier.barbero@example.com', password: '11223344', role: 'user' },
    { nombre: 'Isabel', apellidos: 'López Díaz', dni: '75015391V', email: 'isabel.lópez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Lucia', apellidos: 'Martín Ruiz', dni: '40573164Z', email: 'lucia.martín@example.com', password: '11223344', role: 'user' },
    { nombre: 'Carlos', apellidos: 'Jiménez López', dni: '78740975S', email: 'carlos.jiménez@example.com', password: '11223344', role: 'user' },
    { nombre: 'Elena', apellidos: 'Sanz García', dni: '76962007M', email: 'elena.sanz@example.com', password: '11223344', role: 'user' }
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

insertarUsuariosFicticios().then(() => console.log('Todos los usuarios ficticios han sido insertados.'));
