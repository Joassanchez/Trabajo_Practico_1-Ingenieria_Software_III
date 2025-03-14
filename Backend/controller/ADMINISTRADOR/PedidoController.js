const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Pedido_db = require('model/ADMINISTRADOR/Pedido.js');

app.get('/', getAllPedidos);
app.get('/:nro_pedido',findByID);
app.post('/', createPedido);
app.put('/:nro_pedido', updatePedido);
app.delete('/:nro_pedido', deletePedido);

function getAllPedidos(req, res) {
    Pedido_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}
function findByID(req, res) {
    usuarioDb.findByID(req.params.nro_pedido, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}

function createPedido(req, res) {
    let pedido = req.body;
    Pedido_db.create(pedido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updatePedido(req, res) {
    let datos_pedido = req.body;
    let nro_pedido = req.params.nro_pedido;
    Pedido_db.update(datos_pedido, nro_pedido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deletePedido(req, res) {
    Pedido_db.borrar(req.params.nro_pedido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultado.detail.affectedRows == 0) {
                res.status(404).send(resultado);
            } else {
                res.send(resultado);
            }
        }
    });
}

module.exports = app;
