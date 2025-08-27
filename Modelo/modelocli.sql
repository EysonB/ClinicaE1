-- Crear esquema
CREATE DATABASE IF NOT EXISTS clinica CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE clinica;

-- Tabla Roles
CREATE TABLE Roles (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla Usuarios
CREATE TABLE Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES Roles(idRol)
);

-- Tabla Médicos
CREATE TABLE Medicos (
    idMedico INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(255) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(idUsuario)
);

-- Tabla Pacientes
CREATE TABLE Pacientes (
    idPaciente INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(15),
    direccion TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Citas
CREATE TABLE Citas (
    idCita INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('pendiente','completada','cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (paciente_id) REFERENCES Pacientes(idPaciente),
    FOREIGN KEY (medico_id) REFERENCES Medicos(idMedico)
);

-- Tabla Método de Pago
CREATE TABLE MetodoPago (
    idMetodoPago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla Estado de Facturación
CREATE TABLE EstadoFacturacion (
    idEstadoFacturacion INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);

-- Tabla Facturación
CREATE TABLE Facturacion (
    idFacturacion INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL UNIQUE,
    metodo_pago_id INT NOT NULL,
    estado_facturacion_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES Citas(idCita),
    FOREIGN KEY (metodo_pago_id) REFERENCES MetodoPago(idMetodoPago),
    FOREIGN KEY (estado_facturacion_id) REFERENCES EstadoFacturacion(idEstadoFacturacion)
);
