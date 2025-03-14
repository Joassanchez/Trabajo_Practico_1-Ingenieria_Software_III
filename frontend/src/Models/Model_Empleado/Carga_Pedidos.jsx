import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";


export class Carga_Pedidos extends Component {

    constructor(props) {
        super(props)

        this.state = {

            Pedidos: [],
            detallePedido: [],
            productos: [],

            detalles_Enviar: [],

            CantPedido: '',
            NombredelProducto: '',


            modal: false,
            iddelEmpleado: '',

            statusPedido: false,

        }

        this.showModalConfirmar = this.showModalConfirmar.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleClickCargarVenta = this.handleClickCargarVenta.bind(this);

    }

    componentDidMount() {

        //Fetch para traer los productos de la BD
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

        //FETCH para seguimiento de las ventas hechas        
        fetch("http://localhost:8080/Pedido")
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
                            Pedidos: result.body,
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
    showModalConfirmar() {

        this.setState({
            modal: true,
        })
    }

    closeModal = () => {

        this.setState({
            modal: false,
            statusPedido: false,
        })
        this.eliminarTodo()
    }

    CrearVenta() {
        const detallesPedidoActual = [...this.state.detallePedido];
        const numeroPedido = this.state.Pedidos.length > 0 ? this.state.Pedidos[0].nro_pedido + 1 : 1;

        this.setState({
            detallePedido: detallesPedidoActual,
            nuevaPedido: numeroPedido,
            statusPedido: true,
        });

    }

    eliminarTodo() {
        this.setState({
            
            detallePedido: [],
            detalles_Enviar: [],
        })
    }

    eliminarProducto(IdProducto) {
        const detallesPedidoActual = [...this.state.detallePedido];
        const productoIndex = detallesPedidoActual.findIndex(detalle => detalle.Id_producto === IdProducto);

        if (productoIndex !== -1) {
            // Elimina el producto del array proporcionando el índice y la cantidad de elementos a eliminar (1)
            detallesPedidoActual.splice(productoIndex, 1);
        }

        this.setState({
            detallePedido: detallesPedidoActual,
        });
    }

    decrementarProducto(IdProducto) {
        const detallesPedidoActual = [...this.state.detallePedido];
        const productoIndex = detallesPedidoActual.findIndex(detalle => detalle.Id_producto === IdProducto);

        if (productoIndex !== -1 && detallesPedidoActual[productoIndex].CantPedido > 1) {
            detallesPedidoActual[productoIndex].CantPedido -= 1;

            this.setState({
                detallePedido: detallesPedidoActual,
            });
        }
    }

    agregarProducto(Id_Producto, NombreProducto, precio_unitario) {

        const detallesPedidoActual = [...this.state.detallePedido];
        const detalles_Enviar = [...this.state.detalles_Enviar]
        const productoIndex = detallesPedidoActual.findIndex(detalle => detalle.Id_producto === Id_Producto);

        const numeroVenta = this.state.Pedidos.length > 0 ? this.state.Pedidos[0].nro_pedido + 1 : 1;

        let montoTotal = this.state.CantVenta * precio_unitario;

        if (productoIndex !== -1) {
            detallesPedidoActual[productoIndex].CantPedido += 1;
            
        } else {
            // Si el producto no está en detallesVenta, agrégalo con cantidad 1
            detallesPedidoActual.push({
                Id_producto: Id_Producto,
                CantPedido: 1,
                NombredelProducto: NombreProducto,
                precioProducto: precio_unitario,
            });
        }

        if (productoIndex !== -1) {

            detalles_Enviar[productoIndex].CantPedido += 1;

        } else {

            detalles_Enviar.push({

                nro_pedido: numeroVenta,
                Id_producto: Id_Producto,
                CantPedido: 1
            })
        }

        this.setState({
            Id_producto: Id_Producto,
            CantPedido: this.state.CantPedido + 1,
            NombredelProducto: NombreProducto,
            precioProducto: precio_unitario,

            detallePedido: detallesVentaActual,
            detalles_Enviar: detalles_Enviar

        });
    }

    handleClickCargarVenta() {
        
        var tokenDecoded = jwt_decode(sessionStorage.getItem('token'));
        const idEmpleado = tokenDecoded.usuarioID;

        const detalles_Enviar = this.state.detalles_Enviar;

        // Verifica que los valores estén presentes y válidos
        if (idEmpleado) {
            let parametros = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: idEmpleado,
                    id_metodo: metodoDePagoSeleccionado,
                })
            };

            console.log(parametros.body)

            const url = `http://localhost:8080/Registros/`;

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

                        // Maneja la respuesta de la solicitud aquí
                        if (result.ok) {
                            // Si la solicitud fue exitosa
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
                        } else {
                            // Si hay un error en la solicitud
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
                    })
                .catch(error => {
                    // Maneja los errores de la solicitud aquí
                    console.error("Error:", error);
                    // Muestra un mensaje de error
                });
        };
        if (detalles_Enviar) {

            let parametrosDetalles = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    detalles_Enviar
                })
            };

            console.log(parametrosDetalles.body)

            const url = `http://localhost:8080/Registros/Detalles`;

            fetch(url, parametrosDetalles)
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
                            // Si la solicitud fue exitosa
                            this.closeModal();
                            this.componentDidMount();
                        } else {
                            // Si hay un error en la solicitud
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
                    })
                .catch(error => {
                    // Maneja los errores de la solicitud aquí
                    console.error("Error:", error);
                    // Muestra un mensaje de error
                });
        };
    }


    render() {

        var tokenDecoded = jwt_decode(sessionStorage.getItem('token'));
        const nombreEmpleado = tokenDecoded.nickname;
        const statusVenta = this.state.statusVenta;
        const numeroVenta = this.state.nuevaVenta;
        const detallesVentaActual = [...this.state.detallesVenta];

        return (

            <div className='col-12 mt-2'>
                <div className='col-2 ms-5 p-2 fs-3 bg-white'>
                    <strong>Empleado:</strong> {nombreEmpleado}
                </div>
                <div className='d-flex justify-content-around'>
                    <div className='col-5 bg-light text-dark mg-2'>
                        <div className='p-3 bg-info fs-2 text-dark col-12 '>
                            <div className="row justify-content-between">
                                <div className="col-4">
                                    Venta
                                </div>
                                <div className="col-4 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-dark"
                                        onClick={() => this.CrearVenta()}
                                    >
                                        <i className="bi bi-clipboard-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 mt-4 fs-3">
                            Productos:
                        </div>
                        <div className='col-12 p-3 fs-4 me-5'>
                            <table className='table table-hover '>
                                <tbody>
                                    {this.state.productos.map(producto => (
                                        <tr key={producto.id}>
                                            <td className='align-items-center fs-5'>{producto.NombreProducto}</td>
                                            {
                                                statusVenta === true && (
                                                    <td className='text-center'>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => this.agregarProducto(producto.Id_producto, producto.NombreProducto, producto.precio_venta)}
                                                        >
                                                            <i className="bi bi-plus-circle"></i>

                                                        </button>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='col-5 bg-light '>
                        <div className='p-3 bg-info fs-2 text-dark col-12 '>
                            <div className="row justify-content-between">
                                <div className="col-7">
                                    Detalles de la Venta
                                </div>
                                <div className="col-3 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-dark"
                                        onClick={() => this.eliminarTodo()}
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {statusVenta === false && (
                            <div className='d-flex flex-column justify-self-center align-items-center'>
                                <div className="spinner-border mt-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className="mt-3">
                                    <strong>Esperando Nueva Venta...</strong>
                                </div>
                            </div>
                        )}
                        {
                            statusVenta === true && (

                                <div>
                                    <div className="row justify-content-around">
                                        <div className="col ms-4 p-2 fs-3">
                                            <strong>Venta: </strong>  {numeroVenta}

                                        </div>
                                        <div className="col me-4 p-2 fs-3">
                                            <strong> Empleado:</strong> {nombreEmpleado}
                                        </div>
                                    </div>
                                    <div className="col-2 ms-4 fs-3">
                                        Detalles:
                                    </div>
                                    <div className="col-12 p-3 fs-4">
                                        <table className='table table-hover '>
                                            <tbody>
                                                {this.state.detallesVenta.map(detalles => (
                                                    <tr key={detalles.id}>
                                                        <td className='align-items-center fs-5'>{detalles.NombredelProducto}</td>
                                                        <td className='align-items-center fs-5'>{"$"}{detalles.precioProducto}</td>
                                                        <td className='align-items-center fs-5'>{detalles.CantVenta}</td>
                                                        <td className='text-end'>
                                                            <button
                                                                type="button"
                                                                className="btn btn-dark me-3"
                                                                onClick={() => this.decrementarProducto(detalles.Id_producto)}
                                                            >
                                                                <i className="bi bi-dash-circle"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => this.eliminarProducto(detalles.Id_producto)}
                                                            >
                                                                <i className="bi bi-trash3"></i>
                                                            </button>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <div className="dropdown mg 10" >
                                                    <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                        {this.state.nombreMetodo || 'Seleccionar Método'}
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        {this.state.Metodo_Pago.map((metodo, index) => (
                                                            <li key={index}>
                                                                <a className="dropdown-item" href="#" onClick={() => (
                                                                    this.setState({ metodoDePagoSeleccionado: metodo.id_metodo, nombreMetodo: metodo.NombrePago }),
                                                                    console.log(this.state.metodoDePagoSeleccionado))}>
                                                                    {metodo.NombrePago}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                <div className="container text-center col-5">
                    <div className="row align-items-center m-5">
                        <div className="col">
                            <Button variant="primary col-12" onClick={this.showModalConfirmar}>
                                Cargar Venta
                            </Button>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Desea crear esta Venta ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleClickCargarVenta} >
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}

export default Carga_Pedidos

