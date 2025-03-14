
require('rootpath')();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var usuarioDb = require('../model/ADMINISTRADOR/Usuario.js');

app.post('/login', login);

function login(req, res) {
    const { nickname, password } = req.body;

    usuarioDb.findByNickname(nickname, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const iguales = bcrypt.compareSync(password, result.detail.password);
            if (iguales) {
                let user = {
                    nickname: result.detail.nickname,
                    mail: result.detail.email,
                    nombreROL: result.detail.id_rol,
                    usuarioID: result.detail.id_usuario
                }
                console.log (user.nombreROL)

                jwt.sign(user, 'siliconSectret', { expiresIn: '600s' }, (err, token) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                    } else {
                        res.json({
                            datos: user,
                            token: token
                        });
                    }
                })
            } else {
                res.status(403).send({
                    message: 'Contraseña Incorrecta'
                });
            }
        }
    });
}

// Función para verificar el token en las rutas protegidas
function verificarToken(req, res, next) {
    if (req.headers["authorization"]) {
        try {
            const token = req.headers["authorization"]
            const verified = jwt.verify(token, "siliconSectret");
            if (verified) {
                next(); // Continúa con la siguiente función middleware
            } else {
                res.status(403).send({
                    message: "Token inválido, permiso denegado"
                });
            }
        } catch (error) {
            res.status(403).send({
                message: "Acceso Denegado"
            });
        }
    } else {
        res.status(403).send({
            message: "No posee token de autorización"
        });
    }
}

module.exports = { app, verificarToken };
