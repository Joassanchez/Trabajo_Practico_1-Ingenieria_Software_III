import React, { Component } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import jwt_decode from "jwt-decode";

export class Registros extends Component {

    constructor(props) {
        super(props)

        this.state = {

            ventas: [],
            detalle_venta: [],
            Metodo_Pago: [],
            productos: [],
            idToDelete: null,


            metodoDePagoSeleccionado: '',
            productoSeleccionado: '',
            CantidadVenta: '',
            idToEditMetodo: null,

        }

        this.handleClickDeleteDetalle = this.handleClickDeleteDetalle.bind(this);
        this.handleClickEditDetalle = this.handleClickEditDetalle.bind(this);
        this.handleClickEditMetodo = this.handleClickEditMetodo.bind(this);

        this.showModalEditDetalle = this.showModalEditDetalle.bind(this);
        this.showModalDeleteDetalle = this.showModalDeleteDetalle.bind(this);
        this.showModalDeleteDetalle_venta = this.showModalDeleteDetalle_venta.bind(this);


        this.closeModal = this.closeModal.bind(this);
    }


    componentDidMount() {

        fetch("http://localhost:8080/Registros")
            .then(res => {
                return res.json()
                    .then(body => {
                        console.log(body)
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
                            ventas: result.body,
                            //siempre que se monta el componente el modal tiene que estar cerrado
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


        fetch("http://localhost:8080/Registros/Detalles/")
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
                            detalle_venta: result.body,
                            //siempre que se monta el componente el modal tiene que estar cerrado
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

        fetch("http://localhost:8080/Registros/Metodo_Pago")
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
                            Metodo_Pago: result.body,
                            //siempre que se monta el componente el modal tiene que estar cerrado
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

        fetch("http://localhost:8080/Registros/Detalles/Productos")
            .then(res => {
                return res.json()
                    .then(body => {
                        console.log(body)
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
                            productos: result.body,
                            //siempre que se monta el componente el modal tiene que estar cerrado
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


    showModalEditDetalle(nro_venta) {
        this.setState({
            modalEdit: true,
            idToEditMetodo: nro_venta,
        })
    }

    showModalDeleteDetalle = (id_detalle_venta) => {
        this.setState({
            modal: true,
            idToDelete: id_detalle_venta
        });
    }

    showModalDeleteDetalle_venta = (id_detalle_venta) => {
        this.setState({
            modalEditDetalle: true,
            idToEditDetalle: id_detalle_venta,

        });
    }

    closeModal() {
        this.setState({

            modal: false,
            modalEdit: false,
            modalEditDetalle: false,

            idToDelete: null,
            idToEditMetodo: null,
            nombreMetodo: null,

            idToEditDetalle: null,
            nombreProducto: null,
            metodoDePagoSeleccionado: null
        })
    }

    handleClickEditMetodo() {

        let parametros = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ id_metodo: this.state.metodoDePagoSeleccionado })
        };


        const url = `http://localhost:8080/Registros/${this.state.idToEditMetodo}`

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
                        //al finalizar la modificacion volvemos a invocar el componentDidMount() para recargar nuestro listado

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
                (error) => { console.error('Error:', error); }
            );
    }

    handleClickDeleteDetalle() {

        let parametros = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }
        //this.state.idToDelete se carga cuando abrimos el modal con showModal(vehiculo_id)
        const url = `http://localhost:8080/Registros/Detalles/${this.state.idToDelete}`
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
                        //al finalizar la eliminacion volvemos a invocar el componentDidMount() para recargar nuestro listado
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

    handleClickEditDetalle() {

        let parametros = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({

                Id_producto: this.state.productoSeleccionado, //si o si se debe seleccionar un producto pero es un error, CAMBIAR
                CantVenta: this.state.CantidadVenta
            })
        };

        const url = `http://localhost:8080/Registros/Detalles/${this.state.idToEditDetalle}`

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
                        //al finalizar la modificacion volvemos a invocar el componentDidMount() para recargar nuestro listado

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
                (error) => { console.error('Error:', error); }
            );
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }


    render() {

        var Decoded = jwt_decode(sessionStorage.getItem('token'));
        const nombreROL = Decoded.nombreROL

        return (
            <>
                <div className="container">
                    <br></br>
                    <h1 className="col-3 p-2 fs-2 bg-white mt-4"><strong>  Registro de Ventas</strong></h1>
                    <br></br>
                    <span>{"   "}</span>
                    <div className="accordion" id="accordionExample">
                        {this.state.ventas.map((venta, index) => (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={`heading${index}`}>
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${index}`}
                                        aria-expanded="true"
                                        aria-controls={`collapse${index}`}
                                    >
                                        <table className='table table-striped '>
                                            <thead>
                                                <tr >
                                                    <th className="bg-info">ID DE VENTA</th>
                                                    <th className="bg-info">METODO DE PAGO</th>
                                                    <th className="bg-info">MONTO TOTAL</th>
                                                    <th className="bg-info">USUARIO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{venta.nro_venta}</td>
                                                    <td>{venta.NombrePago}</td>
                                                    <td>{'$'}{venta.Monto_Total}</td>
                                                    <td>{venta.Persona}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </button>

                                </h2>
                                <div
                                    id={`collapse${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading${index}`}
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body overflow-auto">
                                        <table className='table table-striped'>
                                            <thead>
                                                <tr>
                                                    <th>Numero de Venta</th>
                                                    <th>ID Detalle</th>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Unidad de Medida</th>
                                                    <th>Precio x Unidad</th>
                                                    <th>Monto Parcial</th>
                                                    {nombreROL === 1 && (
                                                        <th>Opciones</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.detalle_venta
                                                    .filter(detalle => detalle.nro_venta === venta.nro_venta)
                                                    .map((detalle, detalleIndex) => (
                                                        <tr key={detalleIndex}>
                                                            <td>{detalle.nro_venta}</td>
                                                            <td>{detalle.id_detalle_venta}</td>
                                                            <td>{detalle.NombreProducto}</td>
                                                            <td>{detalle.CantVenta}</td>
                                                            <td>{detalle.unidad_medida}</td>
                                                            <td>{'$'}{detalle.precio_venta}</td>
                                                            <td>{'$'}{detalle.Monto_Parcial}</td>
                                                            {nombreROL === 1 && (
                                                                <td>
                                                                    <button type="button" className="btn btn-primary "
                                                                        onClick={() => this.showModalDeleteDetalle_venta(detalle.id_detalle_venta)}>
                                                                        Editar
                                                                    </button>

                                                                    <button type="button" className="btn btn-danger"
                                                                        onClick={() => this.showModalDeleteDetalle(detalle.id_detalle_venta)}>
                                                                        Eliminar
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                            <tfoot>
                                                {nombreROL === 1 && (
                                                    <button type="button" className="btn btn-success" onClick={() => this.showModalEditDetalle(venta.nro_venta)}>
                                                        Modificar Método de Pago
                                                    </button>
                                                )}
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación de Eliminacion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Está seguro de eliminar el Detalle seleccionado?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={this.handleClickDeleteDetalle}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalEdit} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modificar Metodo de Pago</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.ventas.filter(venta => venta.nro_venta === this.state.idToEditMetodo).map((venta, index) => (
                            <Form>
                                <table className='table table-striped'>
                                    <thead>
                                        <h4>Venta</h4>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th className="">ID DE VENTA
                                                <th className="">MONTO TOTAL
                                                    <th className="">PERSONA
                                                        <th className="">METODO DE PAGO
                                                        </th></th></th></th>
                                            <td>{venta.nro_venta}
                                                <td>{'$'}{venta.Monto_Total}
                                                    <td>{venta.Persona}
                                                        <td>{venta.NombrePago}
                                                        </td></td></td></td>

                                        </tr>
                                    </tbody>
                                </table>

                                <div className="dropdown mg 10" key={index} >
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        {this.state.nombreMetodo || 'Seleccionar Método'}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {this.state.Metodo_Pago.map((metodo, index) => (
                                            <li key={index}>
                                                <a className="dropdown-item" href="#" onClick={() => this.setState({ metodoDePagoSeleccionado: metodo.id_metodo, nombreMetodo: metodo.NombrePago })}>
                                                    {metodo.NombrePago}
                                                </a>
                                            </li>//El a es lo que nos da el warning
                                        ))}
                                    </ul>
                                </div>
                            </Form>
                        ))}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="success" onClick={this.handleClickEditMetodo}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalEditDetalle} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modificar Detalle de Venta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.detalle_venta.filter(detalle => detalle.id_detalle_venta === this.state.idToEditDetalle)
                            .map((detalle, detalleIndex) => (
                                <Form>

                                    <table className='table table-striped' key={detalleIndex}>
                                        <thead>
                                            <h4>Detalle N° {detalle.id_detalle_venta}</h4>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>Numero de Venta
                                                    <th>ID Detalle
                                                        <th>Producto
                                                            <th>Cantidad
                                                                <th>Unidad de Medida
                                                                    <th>Precio x Unidad
                                                                        <th>Monto Parcial
                                                                        </th></th></th></th></th></th></th>

                                                <td>{detalle.nro_venta}
                                                    <td>{detalle.id_detalle_venta}
                                                        <td>{detalle.NombreProducto}
                                                            <td>{detalle.CantVenta}
                                                                <td>{detalle.unidad_medida}
                                                                    <td>{'$'}{detalle.precio_venta}
                                                                        <td>{'$'}{detalle.Monto_Parcial}
                                                                        </td></td></td></td></td></td></td>

                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <div className="dropdown mg 10" key={detalleIndex} >
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                {this.state.nombreProducto || detalle.NombreProducto || 'Seleccionar Método'}
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                {this.state.productos.map((producto, productoIndex) => (
                                                    <li key={productoIndex}>
                                                        <a className="dropdown-item" href="#" onClick={() => this.setState({ productoSeleccionado: producto.Id_producto, nombreProducto: producto.NombreProducto })}>
                                                            {producto.NombreProducto}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <br></br>
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="Cantidad"
                                                placeholder="Cantidad"
                                                min="0"
                                                max="2030"
                                                data-bind="value:replyNumber"
                                                onChange={this.handleChange}
                                                value={this.state.CantidadVenta}
                                                name='CantidadVenta'
                                            />
                                            <label htmlFor="Cantidad">Cantidad del Producto:</label>
                                        </div>
                                    </div>
                                </Form>
                            ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="success" onClick={this.handleClickEditDetalle}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default Registros