require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DetallePedido_db = require('model/ADMINISTRADOR/DetallePedido.js'); 

app.get('/', getAllDetallePedidos);
app.get('/productos', getProductos);
app.post('/', createDetallePedido);
app.put('/:Id_DetallePedido', updateDetallePedido);
app.delete('/:Id_DetallePedido', deleteDetallePedido);

function getProductos(req, res) {
    DetalleVenta_db.getProductos((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function getAllDetallePedidos(req, res) {
    DetallePedido_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createDetallePedido(req, res) {
    let detallePedido = req.body;
    
    DetallePedido_db.create(detallePedido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateDetallePedido(req, res) {
    let datosDetallePedido = req.body;
    let Id_DetallePedido = req.params.Id_DetallePedido;
    DetallePedido_db.update(datosDetallePedido, Id_DetallePedido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteDetallePedido(req, res) {
    console.log(req);
    DetallePedido_db.delete(req.params.Id_DetallePedido, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result.message);
            }
        }
    });
}

module.exports = app;
