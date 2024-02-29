# PARA RESTAURAR LA BBDD

Descomprimir el archivo `PDC.zip` en `./BBDD` y ejecutar el comando siguiente en la terminal. Hay que instalar mongo-tools para poder ejecutar el comando.

```
mongorestore --uri="mongodb://localhost:27017/PDC" /ruta/del/backup/PDC
```
