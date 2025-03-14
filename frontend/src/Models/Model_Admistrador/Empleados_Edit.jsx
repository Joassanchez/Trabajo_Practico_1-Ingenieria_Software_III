import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class Internal_Vehiculos_Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      password: '',
      email: '',
      id_rol: '1',
      // showPwd: false, 
    };
  }

  componentDidMount() {
    if (this.props.params.id_usuario) {
      let parametros = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': sessionStorage.getItem('token'),
        },
      };
      fetch(`http://localhost:8080/usuario/${this.props.params.id_usuario}`, parametros)
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
                nickname: result.body.detail.nickname,
                password: "",
                email: result.body.detail.email,
                id_rol: result.body.detail.id_rol,
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

    let Usuario = {
      nickname: this.state.nickname,
      password: this.state.password,
      email: this.state.email,
      id_rol: this.state.id_rol,
    };

    let Parametros = {
      method: this.props.params.id_usuario ? 'PUT' : 'POST',
      body: JSON.stringify(Usuario),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = this.props.params.id_usuario
      ? `http://localhost:8080/usuario/${this.props.params.id_usuario}`
      : 'http://localhost:8080/usuario/';
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
            this.props.navigate('/Empleados');
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

  // toggleShowPassword = () => {
  //   this.setState((prevState) => ({ showPwd: !prevState.showPwd }));
  // };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>
              <strong>
                {this.props.params.id_usuario
                  ? `Edicion del usuario ${this.props.params.id_usuario}`
                  : 'Nuevo usuario'}
              </strong>
            </h1>

          </div>
        </div>

        <div className="row">
          <div className="col">
            <form onSubmit={this.handleSubmit}>
              <select
                className="form-select"
                id="id_rol"
                aria-label="Default select example"
                onChange={this.handleChange}
                value={this.state.id_rol}
                name="id_rol"
              >
                <option value="1">Administrador</option>
                <option value="2">Empleado</option>
              </select>
              <br />
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingNickname"
                  placeholder="Nickname"
                  onChange={this.handleChange}
                  value={this.state.nickname}
                  name="nickname"
                />
                <label htmlFor="floatingNickname">Nickname</label>
              </div>
              <br />
              <div className="form-floating">
                <input
                  type={this.state.showPwd ? "text" : "password"}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={this.handleChange}
                  value={this.state.password}
                  name="password"
                  required
                  minLength={8}
                  maxLength={20}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Debe contener al menos un número y una letra mayúscula y minúscula, y tener al menos 8 caracteres o más."
                />
                <label htmlFor="floatingPassword">Password</label>
                {/* <div className="position-absolute pointer pwd-icon" onClick={this.toggleShowPassword}>
                  {this.state.showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.5rem"}>
                      {<span class="material-icons">
                        visibility
                      </span>
                      }
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1.5rem"}>
                      {<span class="material-icons">
                        visibility_off
                      </span>}
                    </svg>
                  )}
                </div> */}
              </div>
              <br />
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="Email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  name="email"
                />
                <label htmlFor="floatingEmail">Email</label>
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




export default Vehiculos_Edit



export function Vehiculos_Edit() {
  const p = useParams();

  const navigate = useNavigate();

  return (
    <>
      <Internal_Vehiculos_Edit navigate={navigate} params={p} />
    </>
  );
}
