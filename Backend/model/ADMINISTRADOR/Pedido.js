const mysql = require('mysql');
const configuracion = require('config.json');

var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos de PEDIDO conectada");
    }
});

var Pedido_db = {};

Pedido_db.getAll = (funCallback) => {
    var consulta = 'SELECT p.nro_pedido, p.estado, p.fecha, u.nickname, pro.NombreProducto FROM PEDIDO p INNER JOIN Usuario u ON p.id_usuario = u.id_usuario INNER JOIN PRODUCTO pro ON p.Id_producto = pro.Id_producto;';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback(err);
        } else {
            funCallback(undefined, rows);
        }
    });
}


Pedido_db.create = function (pedido, funcallback) {
    const { id_usuario, Id_producto } = pedido;
    if ( !id_usuario || !Id_producto) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'INSERT INTO PEDIDO (estado, fecha, id_usuario, Id_producto) VALUES (1, CURDATE(), ?, ?)';
    const datos_pedido = [ id_usuario, Id_producto];

    connection.query(query, datos_pedido, function (err, result) {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensajito: "Pedido registrado",
                    detalle: err
                });
            } else {
                funcallback({
                    mensajito: "Error diferente",
                    detalle: err
                });
            }
        } else {
            funcallback(null, {
                mensajito: "Se creó un pedido",
                detalle: result
            });
        }
    });
}

Pedido_db.update = function (datos_pedido, nro_pedido, funcallback) {
    const {estado} = datos_pedido;

    if (!estado) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'UPDATE PEDIDO SET estado=? WHERE nro_pedido=?';
    const consulta = [estado, nro_pedido];

    connection.query(query, consulta, (err, result) => {
        if (err) {
            if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
                funcallback({
                    message: `El número de pedido es incorrecto`,
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
                    message: "No existe pedido que coincida con el número de pedido proporcionado",
                    detail: result
                });
            } else {
                funcallback(null, {
                    message: `Se actualizaron los datos del pedido con número ${nro_pedido}`,
                    detail: result
                });
            }
        }
    });
}


Pedido_db.delete = function (nro_pedido, retorno) {
    const consulta = "DELETE FROM  WHERE nro_pedido = ?";
    connection.query(consulta, nro_pedido, (err, result) => {
        if (err) {
            retorno({ menssage: err.code, detail: err }, undefined);
        } else {
            if (result.affectedRows == 0) {
                retorno(undefined, { message: "No se encontró el pedido, ingrese otro número de pedido", detail: result });
            } else {PEDIDO
                retorno(undefined, { message: "Pedido eliminado", detail: result });
            }
        }
    });
}
Pedido_db.findByID = function (nro_pedido, funCallback) {
    connection.query('SELECT * FROM PEDIDO WHERE nro_pedido = ?', nro_pedido, (err, result) => {
        if (err) {
            funCallback({
                message: "a ocurrido algun error inesperado, revisar codigo de error",
                detail: err
            });
        } else if (result.length == 0) {
            funCallback(undefined, {
                message: `no se encontro el pedido con el ID: ${nro_pedido}`,
                detail: result
            });
        } else {

            funCallback(undefined, {
                message: `Pedido hallado con exito`,
                detail: result[0]
            });
        }
    });

}


module.exports = Pedido_db;
