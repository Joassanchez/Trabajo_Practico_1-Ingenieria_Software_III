import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export class Internal_Proveedor_Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            telefono: '',
            nombre: '',
            especialidad: '',

        };
    }

    componentDidMount() {
        if (this.props.params.Id_proveedor) {
            let parametros = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            };
            fetch(`http://localhost:8080/proveedor/${this.props.params.Id_proveedor}`, parametros)
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
                .then(
                    (result) => {
                        if (result.ok) {
                            this.setState({
                                telefono: result.body.detail.telefono,
                                nombre: result.body.detail.nombre,
                                especialidad: result.body.detail.especialidad,
                            });
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
                    }
                )
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let Proveedor = {
            telefono: this.state.telefono,
            nombre: this.state.nombre,
            especialidad: this.state.especialidad,
        };

        let Parametros = {
            method: this.props.params.Id_proveedor ? 'PUT' : 'POST',
            body: JSON.stringify(Proveedor),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const url = this.props.params.Id_proveedor
            ? `http://localhost:8080/proveedor/${this.props.params.Id_proveedor}`
            : 'http://localhost:8080/proveedor/';
        fetch(url, Parametros)
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
            .then(
                (result) => {
                    if (result.ok) {
                        toast.success(result.body.message, {
                            position: 'bottom-center',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });
                        this.props.navigate('/proveedor');
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
                }
            )
            .catch((error) => {
                console.log(error);
            });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>
                            <strong>
                                {this.props.params.Id_proveedor
                                    ? `Edicion del proveedor ${this.props.params.Id_proveedor}`
                                    : 'Nuevo proveedor'}
                            </strong>
                        </h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingtelefono"
                                    placeholder="telefono"
                                    onChange={this.handleChange}
                                    value={this.state.telefono}
                                    name="telefono"
                                />
                                <label htmlFor="floatintelefono">Telefono</label>
                            </div>
                            <br />
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingnombre"
                                    placeholder="nombre"
                                    onChange={this.handleChange}
                                    value={this.state.nombre}
                                    name="nombre"
                                />
                                <label htmlFor="floatingnombre">Nombre</label>
                            </div>
                            <br />
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingespecialidad"
                                    placeholder="especialidad"
                                    onChange={this.handleChange}
                                    value={this.state.especialidad}
                                    name="especialidad"
                                />
                                <label htmlFor="floatingespecialidad">Especialidad</label>
                            </div>
                            <br />

                            <input className="btn btn-primary" type="submit" value="Guardar" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Proveedor_Edit


export function Proveedor_Edit() {
    const p = useParams();

    const navigate = useNavigate();

    return (
        <>
            <Internal_Proveedor_Edit navigate={navigate} params={p} />
        </>
    );
}
