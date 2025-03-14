require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var usuarioDb = require('model/ADMINISTRADOR/Usuario.js');

const securityController = require("controller/SecurityController.js");

app.get('/',securityController.verificarToken,getAll);
app.get('/:id_usuario',findByID);
app.post('/', createUser);
app.put('/:id_usuario', updateUser);
app.delete('/:id_usuario', deleteUser);



function getAll(req, res) {
    usuarioDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createUser(req, res) {
    let usuario = req.body;
    usuarioDb.create(usuario, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function findByID(req, res) {
    usuarioDb.findByID(req.params.id_usuario, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
}



function updateUser(req, res) {
    let datos_usuario = req.body; 
    let id_usaurio = req.params.id_usuario 
    usuarioDb.update(datos_usuario, id_usaurio, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado)
        }
    })
}


function deleteUser(req, res) {
    usuarioDb.borrar(req.params.id_usuario, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result);
            }
        }
    });
}


module.exports = app;
