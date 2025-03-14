import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
function Menu() {
    const navigate = useNavigate();

    const [token, setToken] = useState("");

    useEffect(() => {
        const t = sessionStorage.getItem('token')
        if (t !== token) {
            setToken(t)
        }
    });


    function logout() {
        sessionStorage.removeItem('token');
        setToken("");
        navigate("/");

    }

    // const token = sessionStorage.getItem('token')
    if (token !== "" && token !== null) {
        var Decoded = jwt_decode(token);
        if (Decoded.nombreROL === 1) {
            return (
                <>
                    <nav className="navbar nav navbar-expand-lg bg-info fs-5">
                        <div className="container fluid">
                            <a class="navbar-brand" href="#">
                                Heladeria Los Copos</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link to="/Empleados" className='nav-link'> Usuarios</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/proveedor" className='nav-link'> Proveedores</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/Registros" className='nav-link'> Registro Ventas</Link>
                                    </li>
                                </ul>
                                <div className="nav-item ms-3">
                                    <button className='btn btn-dark' onClick={() => logout()}>
                                        <i class="bi bi-box-arrow-left"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </>
            )
        } else {
            return (
                <>
                    <nav className="navbar navbar-expand-lg bg-info fs-5">
                        <div className="container fluid">
                            <a class="navbar-brand" href="#">
                                Heladeria Los Copos</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link to="/Venta" className='nav-link'> Venta</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/Registros" className='nav-link'> Registro Ventas</Link>
                                    </li>
                                </ul>
                                <div className="nav-item ms-2 ">
                                    <button className='btn btn-dark' onClick={() => logout()}>
                                        <i class="bi bi-box-arrow-left"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </>
            )
        }

    } else {
        return (
            <>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container">
                        <Link to="/" className='nav-link'> Login</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                    </div>
                </nav>
            </>
        )
    }

}

export default Menu