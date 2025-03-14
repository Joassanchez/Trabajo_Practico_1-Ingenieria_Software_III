import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: '',
            password: '',
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let usuario = {
            nickname: this.state.nickname,
            password: this.state.password,
        };

        let parametros = {
            method: 'POST',
            body: JSON.stringify(usuario),
            headers: {
                'Content-Type': 'application/json',
            }
        }

        fetch('http://localhost:8080/security/login', parametros)
            .then((res) => {
                return res.json().then((body) => {
                    return {
                        status: res.status,
                        ok: res.ok,
                        headers: res.headers,
                        body: body,
                    };
                });
            })
            .then((result) => {
                if (result.ok) {
                    sessionStorage.setItem('token', result.body.token);
                    toast.success('Bienvenido', {
                        position: 'bottom-center',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    var tokenDecoded = jwt_decode(result.body.token);

                    if (tokenDecoded.nombreROL === 1) {
                        this.props.navigate('/Empleados');
                    } else {
                        this.props.navigate('/Venta');
                    }
                } else {
                    toast.error(result.body.message, {
                        position: 'bottom-center',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                }
            })
            .catch((error) => {
                toast.error(error.message, {
                    position: 'bottom-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <div className="container ">
                <div className="row">
                    <div className="col-3 p-2 fs-1 bg-white mt-4 ms-3">
                        <h1><strong>Iniciar Sesión</strong></h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nickname"
                                    onChange={this.handleChange}
                                    value={this.state.nickname}
                                    name="nickname"
                                />
                                <label htmlFor="nickname">Usuario</label>
                            </div>
                            <br />

                            <div className="form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    name="password"
                                />
                                <label htmlFor="password">Contraseña</label>
                            </div>
                            <br />

                            <input className="btn btn-primary" type="submit" value="Ingresar" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default function LoginWrapper() {
    const p = useParams();
    const navigate = useNavigate();

    return (
        <>
            <Login navigate={navigate} params={p} />
        </>
    );
}
