require('rootpath')();
const mysql = require('mysql');
const configuracion = require('config.json');
var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos de DETALLE_PEDIDO conectada");
    }
});

var DetallePedido_db = {};

DetallePedido_db.getAll = (funcallback) => {
    var consulta = 'SELECT dp.Id_DetallePedido, dp.CantPedido, p.nro_pedido, p.estado, p.fecha, u.nickname, pro.NombreProducto FROM DETALLE_PEDIDO dp INNER JOIN PEDIDO p ON dp.nro_pedido = p.nro_pedido INNER JOIN Usuario u ON p.id_usuario = u.id_usuario INNER JOIN PRODUCTO pro ON dp.Id_producto = pro.Id_producto; ';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, rows);
        }
    });
}

DetallePedido_db.getProductos = (funCallback) => {

    var consulta = 'SELECT * FROM PRODUCTO';
    
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback(err);
        } else {
            funCallback(undefined, rows); 
        }
    });
}//LISTAR

// Función para crear un nuevo detalle de pedido
DetallePedido_db.create = function (detallePedido, funcallback) {
    const { CantPedido, nro_pedido, Id_producto, Id_proveedor } = detallePedido;
    if (!CantPedido || !nro_pedido || !Id_producto || !Id_proveedor) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'INSERT INTO DETALLE_PEDIDO (CantPedido, nro_pedido, Id_producto, Id_proveedor) VALUES (?, ?, ?, ?)';
    const datosDetallePedido = [CantPedido, nro_pedido, Id_producto, Id_proveedor];

    connection.query(query, datosDetallePedido, function (err, result) {
        if (err) {
            funcallback({
                message: "Error al crear el detalle de pedido",
                detail: err
            });
        } else {
            funcallback(null, {
                message: "Detalle de pedido creado correctamente",
                detail: result
            });
        }
    });
}

// Función para actualizar un detalle de pedido existente
DetallePedido_db.update = function (Id_DetallePedido, nuevoDetallePedido, funcallback) {
    const { CantPedido, Id_producto } = nuevoDetallePedido;
    console.log(CantPedido)
    console.log(Id_producto)
    if (!CantPedido || !Id_producto) {
        return funcallback({ error: '"Faltan campos obligatorios"' });
    }

    const query = 'UPDATE DETALLE_PEDIDO SET CantPedido = ?, Id_producto = ? WHERE Id_DetallePedido = ?';
    const datosDetallePedido = [CantPedido, Id_producto, Id_DetallePedido];

    connection.query(query, datosDetallePedido, function (err, result) {
        if (err) {
            funcallback({
                message: "Error al actualizar el detalle de pedido",
                detail: err
            });
        } else {
            funcallback(null, {
                message: "Detalle de pedido actualizado correctamente",
                detail: result
            });
        }
    });
}


DetallePedido_db.delete = function (Id_DetallePedido, funcallback) {
    consulta = "DELETE FROM DETALLE_PEDIDO WHERE Id_DetallePedido = ?";
    connection.query(consulta, Id_DetallePedido, (err, result) => {
        if (err) {
            funcallback({
                message: "a ocurrido algun error inesperado, revisar codigo de error",
                detail: err
            }); 
        } else {
            if (result.affectedRows == 0) {
                funcallback(undefined, { message: `"No se encontró el detalle de pedido, ingrese otro ID"`, detail: result });
            } else {
                funcallback(undefined, { message: `"Detalle de pedido eliminado"`, detail: result });
            }
        }
    });
}


module.exports = DetallePedido_db;
