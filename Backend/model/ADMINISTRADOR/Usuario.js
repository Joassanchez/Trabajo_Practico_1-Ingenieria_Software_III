require('rootpath')();
const mysql = require('mysql');
const configuracion = require('config.json');
const bcrypt = require('bcrypt');

var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos de usuario conectada");
    }
});

var usuario_db = {};

usuario_db.getAll = (funCallback) => {
    var consulta = 'SELECT U.nickname, U.password, U.email, U.id_usuario, R.nombreROL FROM Usuario U INNER JOIN ROL R on U.id_rol = R.id_rol';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback(err);
        } else {
            funCallback(undefined, rows);
        }
    });
}//LISTAR

usuario_db.create = function (usuario, funcallback) {
    const { nickname, password, email, id_rol } = usuario;

    if (!nickname || !password || !email || !id_rol) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    let claveCifrada = bcrypt.hashSync(usuario.password, 10);

    const query = 'INSERT INTO Usuario (nickname, password, email, id_rol) VALUES (?, ?, ?, ?)';
    const datos_usuario = [nickname, claveCifrada, email, id_rol];

    connection.query(query, datos_usuario, function (err, result) {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    message: "El usuario ya fue registrado",
                    detalle: err
                });
            } else {
                funcallback({
                    message: "Error diferente",
                    detalle: err
                });
            }
        } else {
            funcallback(undefined, {
                message: "Se creó el usuario " + usuario.nickname,
                detalle: result
            });
        }
    });
};//CREATE

usuario_db.update = function (usuario, id_usuario, funcallback) {
    const { nickname, password, email, id_rol } = usuario;

    if (!nickname || !password || !email) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    let claveCifrada = bcrypt.hashSync(usuario.password, 10);

    const query = 'UPDATE usuario SET nickname=?, password=?, email=?, id_rol=? WHERE id_usuario=?';
    const consulta = [nickname, claveCifrada, email,id_rol, id_usuario];
    connection.query(query, consulta, (err, result) => {
        if (err) {
            if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
                funcallback({
                    message: `El id de usuario es incorrecto`,
                    detail: err
                });
            } else {
                funcallback({
                    message: `Error desconocido`,
                    detail: err
                });
            }
        } else {
            if (result.affectedRows === 0) {
                funcallback({
                    message: "No existe el usuario que coincida con el criterio de búsqueda",
                    detail: result
                });
            } else {
                funcallback(null, {
                    message: `Se actualizaron los datos del Usuario con ID ${id_usuario}`,
                    detail: result
                });
            }
        }
    });

};//UPDATE
usuario_db.borrar = function (id_usuario, funCallback) {
    consulta = "DELETE FROM USUARIO WHERE id_usuario = ?";
    connection.query(consulta, id_usuario, (err, result) => {
        if (err) {
            funCallback({ 
                message: err.code, 
                detail: err 
            });

        } else {

            if (result.affectedRows == 0) {
                funCallback(undefined, {
                    message: 'No se encontró el usuario, ingrese otro ID',
                    detail: result
                });
            } else {
                funCallback(undefined, {
                    message: 'Usuario eliminado con exito',
                    detail: result
                });
            }
            
        }
    });
}



usuario_db.findByNickname = function (nickname, funCallback) {
    var consulta = 'SELECT Usuario.*, ROL.NombreRol FROM Usuario INNER JOIN ROL ON Usuario.id_rol = ROL.id_rol WHERE Usuario.nickname = ?';
    connection.query(consulta, nickname, function (err, result) {
        if (err) {
            funCallback(err);
            return;
        } else {

            if (result.length > 0) {
                funCallback(undefined, {
                    message: `Usuario encontrado`,
                    detail: result[0]
                });
            } else {
                funCallback({
                    message: "No existe un usuario que coincida con el criterio de busqueda",
                    detail: result
                });
            }
        }
    });
}

usuario_db.findByID = function (id_usuario, funCallback) {
    connection.query('SELECT * FROM usuario WHERE id_usuario = ?', id_usuario, (err, result) => {
        if (err) {
            funCallback({
                message: "a ocurrido algun error inesperado, revisar codigo de error",
                detail: err
            });
        } else if (result.length == 0) {
            funCallback(undefined, {
                message: `no se encontro un usuario con el ID: ${id_usuario}`,
                detail: result
            });
        } else {

            funCallback(undefined, {
                message: `usuario hallado con exito`,
                detail: result[0]
            });
        }
    });

}

module.exports = usuario_db;
