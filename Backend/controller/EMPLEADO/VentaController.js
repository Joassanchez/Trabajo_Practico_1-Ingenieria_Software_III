require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const Venta_db = require('../../model/EMPLEADO/Venta.js');

app.get('/', getAll);
app.get('/Metodo_Pago', getMetodo_Pago);
app.post('/', createVenta);
app.put('/:nro_venta', updateVenta);
app.delete('/:nro_venta', deleteVenta);

function getMetodo_Pago(req, res) {
    Venta_db.getMetodo_Pago((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function getAll(req, res) {
    Venta_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createVenta(req, res) {
    let venta = req.body;
    Venta_db.create(venta, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateVenta(req, res) {
    let datos_venta = req.body;
    let nro_venta = req.params.nro_venta; 
    
    Venta_db.update(datos_venta, nro_venta, (err, resultado) => { 
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteVenta(req, res) {
    Venta_db.borrar(req.params.nro_venta, (err, result_model) => {
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