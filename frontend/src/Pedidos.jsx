import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class Pedidos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pedidos: [],
      detallePedidos: [],
      modal: false,
      idToDelete: null,
    };

    this.handleClickDeletePedido = this.handleClickDeletePedido.bind(this);
    this.handleClickEditPedido = this.handleClickEditPedido.bind(this);
    this.showModalDeletePedido = this.showModalDeletePedido.bind(this);
    this.showModalEditPedido = this.showModalEditPedido.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    let parametros = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': sessionStorage.getItem('token')
      }
    };

    // Realiza una solicitud HTTP para obtener datos de pedidos
    fetch("http://localhost:8080/pedido", parametros)
      .then(res => {
        return res.json().then(body => {
          return {
            status: res.status,
            ok: res.ok,
            headers: res.headers,
            body: body
          };
        });
      })
      .then(result => {
        if (result.ok) {
          this.setState({
            pedidos: result.body,
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  showModalDeletePedido(idPedido) {
    this.setState({
      modal: true,
      idToDelete: idPedido,
    });
  }

  showModalEditPedido(idPedido) {
    // Implementa la lógica para mostrar el modal de edición de pedido
    // Puedes utilizar el estado para saber qué pedido se está editando y abrir el modal correspondiente
  }

  closeModal() {
    this.setState({
      modal: false,
      idToDelete: null,
    });
  }

  handleClickDeletePedido() {
    let parametros = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const url = `http://localhost:8080/pedido/${this.state.idToDelete}`;
    fetch(url, parametros)
      .then(res => {
        return res.json().then(body => {
          return {
            status: res.status,
            ok: res.ok,
            headers: res.headers,
            body: body
          };
        });
      })
      .then(result => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleClickEditPedido() {
    // Implementa la lógica para editar un pedido
    // Asegúrate de manejar los errores y mostrar mensajes de éxito o error
  }

  render() {
    return (
      <>
        {/* Renderiza la lista de pedidos y detalles de pedidos en una estructura similar a la del primer código */}
        {/* Implementa la tabla de pedidos y la lista de detalles de pedidos */}
        {/* Agrega botones para editar y eliminar pedidos y detalles de pedidos */}
        {/* Implementa la funcionalidad de los modales de edición y eliminación */}
      </>
    );
  }
}
