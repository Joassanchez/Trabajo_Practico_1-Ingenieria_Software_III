CREATE DATABASE IceCreamCopos;
USE IceCreamCopos;


CREATE TABLE ROL -- Tabla Estatica--
(
  id_rol INT NOT NULL,
  NombreRol VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_rol)
);

CREATE TABLE Usuario -- Tabla Dinamica--
(
  password VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  id_usuario INT auto_increment NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

CREATE TABLE PROVEEDOR -- Tabla Dinamica--
(
  Id_proveedor INT auto_increment NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  especialidad VARCHAR(50) NOT NULL,
  PRIMARY KEY (Id_proveedor)
);

CREATE TABLE PRODUCTO -- Tabla Estatica--
(
  Id_producto INT auto_increment NOT NULL,
  NombreProducto VARCHAR(50) NOT NULL,
  precio_venta FLOAT NOT NULL,
  unidad_medida VARCHAR(50) NOT NULL,
  CONSTRAINT PRIMARY KEY (Id_producto , precio_venta)
);

CREATE TABLE Metodo_Pago -- Tabla Estatica--
(
  id_metodo INT NOT NULL,
  NombrePago VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_metodo)
);

CREATE TABLE PEDIDO -- Tabla Dinamica-- Joa
(
  nro_pedido INT auto_increment NOT NULL,
  estado INT NOT NULL,
  fecha DATE NOT NULL,
  id_usuario INT NOT NULL,
  Id_producto INT NOT NULL,
  PRIMARY KEY (nro_pedido),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (Id_producto) REFERENCES PRODUCTO(Id_producto)
);

CREATE TABLE DETALLE_PEDIDO -- Tabla Dinamica-- JOA
(
  Id_DetallePedido INT auto_increment NOT NULL,
  CantPedido INT NOT NULL,
  nro_pedido INT NOT NULL,
  Id_producto INT NOT NULL,
  Id_proveedor INT NOT NULL,
  PRIMARY KEY (Id_DetallePedido),
  FOREIGN KEY (nro_pedido) REFERENCES PEDIDO(nro_pedido),
  FOREIGN KEY (Id_producto) REFERENCES PRODUCTO(Id_producto),
  FOREIGN KEY (Id_proveedor) REFERENCES PROVEEDOR(Id_proveedor)
);

CREATE TABLE VENTA -- Tabla Dinamica--
(
  nro_venta INT auto_increment NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  id_metodo INT NOT NULL,
  id_usuario INT NOT NULL,
  Monto_Total FLOAT,
  PRIMARY KEY (nro_venta),
  FOREIGN KEY (id_metodo) REFERENCES Metodo_Pago(id_metodo),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE DETALLE_VENTA -- Tabla Dinamica--
(
  id_detalle_venta INT auto_increment NOT NULL,
  CantVenta INT NOT NULL,
  Id_producto INT NOT NULL,
  nro_venta INT NOT NULL,
  PrecioUnitario float ,
  Monto_Parcial float GENERATED ALWAYS as(CantVenta * PrecioUnitario),
  PRIMARY KEY (id_detalle_venta),
  FOREIGN KEY (Id_producto , PrecioUnitario) REFERENCES PRODUCTO(Id_producto , precio_venta),
  FOREIGN KEY (nro_venta) REFERENCES VENTA(nro_venta)
);

INSERT INTO ROL (id_rol , NombreRol) 
VALUES ( 1 , "ADMINISTRADOR"),( 2 ,"EMPLEADO");

--Contraseña: ADMIN
INSERT INTO Usuario (password, nickname, email, id_rol ) 
VALUES ("$2a$10$9I5l/TqOGD5m3M8HJME2iORxJUJ6.lnMSubIufH9PK9vyCbReXHZW", "ADMIN", "ADMIN@MAIL","1");

INSERT INTO Metodo_Pago (id_metodo , NombrePago) 
VALUES ( 1, "EFECTIVO"),(2 , "TARJETA"),(3, "MP");

INSERT INTO PRODUCTO (NombreProducto, precio_venta, unidad_medida) 
VALUES 
("Pote Grande", 2800 , "1Kg"),("Pote Mediano", 2000 , "1/2Kg"),("Pote Chico", 1500 , "1/4Kg"),
("Cucurucho Grande", 1200 , "3 gustos"),("Cucurucho Mediano", 800 , "2 gustos"),("Cucurucho Chico", 500 , "1 gusto");

