const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const proveedorDb = require('../../model/ADMINISTRADOR/Proveedor');

app.get('/', getAll);
app.get('/:Id_proveedor',findByID);
app.post('/', createProveedor);
app.put('/:Id_proveedor', updateProveedor);
app.delete('/:Id_proveedor', deleteProveedor);

function getAll(req, res) {
    proveedorDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createProveedor(req, res) {
    const proveedor = req.body;
    proveedorDb.create(proveedor, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateProveedor(req, res) {
    const datos_proveedor = req.body;
    const Id_proveedor = req.params.Id_proveedor;
    proveedorDb.update(datos_proveedor, Id_proveedor, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteProveedor(req, res) {
    const Id_proveedor = req.params.Id_proveedor;
    proveedorDb.borrar(Id_proveedor, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultado.detail.affectedRows === 0) {
                res.status(404).send(resultado);
            } else {
                res.send(resultado);
            }
        }
    });
}
function findByID(req, res) {
    proveedorDb.findByID(req.params.Id_proveedor, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}

module.exports = app;
