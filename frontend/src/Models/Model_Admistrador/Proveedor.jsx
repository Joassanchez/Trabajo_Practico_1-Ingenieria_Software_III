import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";
import { TrashFill, Pencil } from 'react-bootstrap-icons';


export class Proveedor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Proveedores: [],
            modal: false
        }
        this.handleClickDelete = this.handleClickDelete.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
    }


    componentDidMount() {

        let parametros = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('token')
            }
        }



        fetch("http://localhost:8080/proveedor", parametros)
            .then(res => {
                return res.json()
                    .then(body => {
                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            }).then(

                result => {
                    if (result.ok) {
                        this.setState({
                            Proveedores: result.body,
                            modal: false
                        });
                    } else {
                        toast.error(result.body.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                }
            ).catch(
                (error) => { console.log(error) }
            );
    }

    closeModal() {
        this.setState({
            modal: false,
            idToDelete: null
        })
    }

    showModal(Id_proveedor) {

        this.setState({
            modal: true,
            idToDelete: Id_proveedor
        })
    }


    handleClickDelete() {
        let parametros = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const url = `http://localhost:8080/proveedor/${this.state.idToDelete}`
        fetch(url, parametros)
            .then(res => {
                return res.json()
                    .then(body => {
                        return {
                            status: res.status,
                            ok: res.ok,
                            headers: res.headers,
                            body: body
                        };
                    })
            }).then(
                result => {
                    if (result.ok) {
                        toast.success(result.body.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        this.closeModal();
                        this.componentDidMount();
                    } else {
                        toast.error(result.body.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                }
            ).catch(
                (error) => { console.log(error) }
            );
    }



    render() {

        var tokenDecoded = jwt_decode(sessionStorage.getItem('token'));
        const rol = tokenDecoded.rol;
        const filas = this.state.Proveedores.map((Proveedor, index) => {
            return (
                <tr key={index}>
                    <td>{Proveedor.telefono}</td>
                    <td>{Proveedor.nombre}</td>
                    <td>{Proveedor.especialidad}</td>
                    <td>
                        <Link to={`/proveedor/Edit/${Proveedor.Id_proveedor}`} className='btn btn-primary me-2'>
                            <Pencil />
                        </Link>


                        <button className='btn btn-danger' onClick={() => this.showModal(Proveedor.Id_proveedor)}>
                            <TrashFill />
                        </button>

                    </td>
                </tr>
            )

        });
        return (
            <>
                <div className='container'>
                    <div>
                        <h1 className="col-3 p-2 fs-2 bg-white mt-4">
                            <strong>Proveedores</strong>
                            <br />
                        </h1>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Telefono</th>
                                    <th>Nombre</th>
                                    <th>Especialidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filas}
                            </tbody>

                        </table>

                    </div>
                    <Link to="/proveedor/Edit" className='btn btn-primary'><span className="material-symbols">Nuevo</span></Link>

                </div>

                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación de Eliminacion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Está seguro de eliminar el usuario seleccionado?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleClickDelete}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );

    }
}

export default Proveedor



