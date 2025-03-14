require('rootpath')();
const mysql = require('mysql');
const configuracion = require('config.json'); 



var connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos de DETALLE_VENTA conectada");
    }
});

var DetalleVenta_db = {};

DetalleVenta_db.getProductos = (funCallback) => {

    var consulta = 'SELECT * FROM PRODUCTO';
    
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback(err);
        } else {
            funCallback(undefined, rows); 
        }
    });
}//LISTAR

DetalleVenta_db.getAll = (funCallback) => {

    var consulta = 'SELECT dv.nro_venta, dv.id_detalle_venta, dv.CantVenta, p.NombreProducto, p.precio_venta, p.unidad_medida, (dv.CantVenta * p.precio_venta) AS Monto_Parcial FROM DETALLE_VENTA dv JOIN PRODUCTO p ON dv.Id_producto = p.Id_producto;';
    
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback(err);
        } else {
            funCallback(undefined, rows); 
        }
    });
}//LISTAR

DetalleVenta_db.create = function (detallesVenta, funcallback) {
    const detalles_Enviar = detallesVenta.detalles_Enviar;
    
    if (!detalles_Enviar || !Array.isArray(detalles_Enviar) || detalles_Enviar.length === 0) {
        return funcallback({ error: 'Faltan detalles de venta' });
    }

    let completedOperations = 0; //Utilizamos un contador de las operaciones que hay que cargar 
    const totalOperations = detalles_Enviar.length; 
    //Una vez que este contador llega al valor de la cantidad de operaciones, ahi se realiza la funcallback
    const errors = [];

    // Itera sobre cada detalle de venta y realiza la inserción en la base de datos
    detalles_Enviar.forEach(detalle => {
        const { nro_venta, Id_producto, CantVenta } = detalle;
        const query = 'INSERT INTO DETALLE_VENTA (nro_venta , Id_producto, CantVenta) VALUES (?, ?, ?);';
        const datos_DetalleVenta = [nro_venta, Id_producto, CantVenta]; 

        connection.query(query, datos_DetalleVenta, function (err, result) {
            if (err) {
                errors.push(err);
            }

            completedOperations++;

            // Si todas las operaciones se han completado, llama a funcallback
            if (completedOperations === totalOperations) {
                if (errors.length > 0) {
                    funcallback({ error: 'Error en las operaciones de la base de datos', details: errors });
                } else {
                    funcallback(null, { message: 'Operaciones completadas exitosamente' });
                }
            }
        });
    });
};



DetalleVenta_db.update = function (datos_venta, detalle_venta, funcallback) {
    const { Id_producto, CantVenta } = datos_venta;

    if ( !Id_producto || !CantVenta) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'UPDATE DETALLE_VENTA SET Id_producto=?, CantVenta=? WHERE id_detalle_venta=?';
    const consulta = [Id_producto, CantVenta , detalle_venta]; 

    connection.query(query, consulta, (err, result) => {
        if (err) {
            if (err.code === "ER_TRUNCATED_WRONG_VALUE") { 
                funcallback({
                    message: `El id del DETALLE es incorrecto`,
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
                    message: "No existe DETALLE que coincida con el criterio de búsqueda",
                    detail: result
                });
            } else {
                funcallback(null, {
                    message: `Se actualizaron los datos de DETALLE con ID ${detalle_venta}`, 
                    detail: result
                });
            }
        }
    });
};//UPDATE

DetalleVenta_db.borrar = function (eliminar, retorno) {
    
    consulta = "DELETE FROM DETALLE_VENTA WHERE id_detalle_venta = ?";
    connection.query(consulta, eliminar, (err, result) => {
        if (err) {
            retorno({ menssage: err.code, detail: err }, undefined);

        } else {

            if (result.affectedRows == 0) {
                retorno(undefined, { 
                    message: `no se encontro el DETALLE a eliminar, ingrese otro id`, 
                    detail: result });
            } else {
                retorno(undefined,  {
                    message: `"DETALLE ELIMINADO"`, 
                    detail: result });
            }
        }
    });
};//DELETE


module.exports = DetalleVenta_db;