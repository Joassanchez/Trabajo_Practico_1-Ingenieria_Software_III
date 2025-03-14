require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const DetalleVenta_db = require('model/EMPLEADO/DetalleVenta.js');

app.get('/', getAll);
app.get('/Productos', getProductos);
app.post('/', createDetalleVenta);
app.put('/:id_detalle_venta', updateDetalleVenta);
app.delete('/:id_detalle_venta', deleteDetalleVenta);


function getProductos(req, res) {
    DetalleVenta_db.getProductos((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function getAll(req, res) {
    DetalleVenta_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createDetalleVenta(req, res) {
    let venta = req.body;
    DetalleVenta_db.create(venta, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateDetalleVenta(req, res) {
    let datos_venta = req.body;
    let detalle_venta = req.params.id_detalle_venta;
    
    console.log(datos_venta)

    DetalleVenta_db.update(datos_venta, detalle_venta, (err, resultado) => { 
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteDetalleVenta(req, res) {

    let eliminar = req.params.id_detalle_venta;

    DetalleVenta_db.borrar(eliminar, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    });
}

module.exports = app;