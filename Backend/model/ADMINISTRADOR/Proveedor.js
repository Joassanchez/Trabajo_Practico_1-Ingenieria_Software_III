const mysql = require('mysql');
const configuracion = require('config.json');

const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos de proveedor conectada");
    }
});

const proveedor_db = {};

proveedor_db.getAll = (funcallback) => {
    const consulta = 'SELECT * FROM PROVEEDOR';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, rows);
        }
    });
};

proveedor_db.create = (proveedor, funcallback) => {
    const { telefono, nombre, especialidad } = proveedor;
    if (!telefono || !nombre || !especialidad) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'INSERT INTO PROVEEDOR (telefono, nombre, especialidad) VALUES (?, ?, ?)';
    const datos_proveedor = [telefono, nombre, especialidad];

    connection.query(query, datos_proveedor, (err, result) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, {
                message: "Proveedor creado con éxito",
                detail: result
            });
        }
    });
};

proveedor_db.update = (datos_proveedor, Id_proveedor, funcallback) => {
    const { telefono, nombre, especialidad } = datos_proveedor;

    if (!telefono || !nombre || !especialidad) {
        return funcallback({ error: 'Faltan campos obligatorios' });
    }

    const query = 'UPDATE PROVEEDOR SET telefono=?, nombre=?, especialidad=? WHERE Id_proveedor=?';
    const consulta = [telefono, nombre, especialidad, Id_proveedor];

    connection.query(query, consulta, (err, result) => {
        if (err) {
            funcallback(err);
        } else {
            if (result.affectedRows === 0) {
                funcallback({
                    message: "No existe un proveedor que coincida con el criterio de búsqueda",
                    detail: result
                });
            } else {
                funcallback(undefined, {
                    message: `Se actualizaron los datos del proveedor con ID ${Id_proveedor}`,
                    detail: result
                });
            }
        }
    });
};

proveedor_db.borrar = (Id_proveedor, funcallback) => {
    const consulta = "DELETE FROM PROVEEDOR WHERE Id_proveedor = ?";
    connection.query(consulta, Id_proveedor, (err, result) => {
        if (err) {
            funcallback({
                message: '"a ocurrido algun error inesperado, revisar codigo de error"',
                detail: err
            });
        } else {
            if (result.affectedRows === 0) {
                funcallback({
                    message: '"No se encontró el proveedor, ingrese otro ID"',
                    detail: result
                });
            } else {
                funcallback(undefined, {
                    message: "Proveedor eliminado con éxito",
                    detail: result
                });
            }
        }
    });
};
proveedor_db.findByID = function (Id_proveedor, funCallback) {
    connection.query('SELECT * FROM PROVEEDOR WHERE Id_proveedor = ?', Id_proveedor, (err, result) => {
        if (err) {
            funCallback({
                message: '"a ocurrido algun error inesperado, revisar codigo de error"',
                detail: err
            });
        } else if (result.length == 0) {
            funCallback(undefined, {
                message: `no se encontro un Proveedor con el ID: ${Id_proveedor}`,
                detail: result
            });
        } else {

            funCallback(undefined, {
                message: `"usuario hallado con exito"`,
                detail: result[0]
            });
        }
    });

}

module.exports = proveedor_db;
