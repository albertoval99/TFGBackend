-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('administrador', 'entrenador', 'jugador')) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true
);

-- Crear tabla Ligas
CREATE TABLE Ligas (
    id_liga SERIAL PRIMARY KEY,
    nombre_liga VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    temporada VARCHAR(20) NOT NULL,
    descripcion TEXT
);

-- Crear tabla Equipos
CREATE TABLE Equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre_equipo VARCHAR(100) NOT NULL,
    entrenador_id INTEGER REFERENCES Usuarios(id_usuario),
    categoria VARCHAR(50) NOT NULL,
    fundacion INTEGER,
    id_liga INTEGER REFERENCES Ligas(id_liga),
    escudo VARCHAR(255),
    UNIQUE(nombre_equipo, id_liga)
);

-- Crear tabla Jugadores
CREATE TABLE Jugadores (
    id_jugador SERIAL PRIMARY KEY,
    nombre_jugador VARCHAR(100) NOT NULL,
    id_equipo INTEGER REFERENCES Equipos(id_equipo),
    posicion VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    numero_camiseta INTEGER,
    foto VARCHAR(255),
    UNIQUE(id_equipo, numero_camiseta)
);

-- Crear tabla Partidos
CREATE TABLE Partidos (
    id_partido SERIAL PRIMARY KEY,
    fecha_partido DATE NOT NULL,
    hora_partido TIME NOT NULL,
    equipo_local_id INTEGER REFERENCES Equipos(id_equipo),
    equipo_visitante_id INTEGER REFERENCES Equipos(id_equipo),
    resultado VARCHAR(10),
    ubicacion VARCHAR(100) NOT NULL,
    arbitro VARCHAR(100),
    id_liga INTEGER REFERENCES Ligas(id_liga),
    jornada INTEGER NOT NULL,
    CHECK (equipo_local_id != equipo_visitante_id)
);

-- Crear tabla Entrenamientos
CREATE TABLE Entrenamientos (
    id_entrenamiento SERIAL PRIMARY KEY,
    fecha_hora_entrenamiento TIMESTAMP NOT NULL,
    id_equipo INTEGER REFERENCES Equipos(id_equipo),
    duracion INTEGER NOT NULL CHECK (duracion > 0)
);

-- Crear tabla Asistencias
CREATE TABLE Asistencias (
    id_asistencia SERIAL PRIMARY KEY,
    id_entrenamiento INTEGER REFERENCES Entrenamientos(id_entrenamiento),
    id_jugador INTEGER REFERENCES Jugadores(id_jugador),
    asistio BOOLEAN NOT NULL DEFAULT false,
    justificacion TEXT,
    UNIQUE(id_entrenamiento, id_jugador)
);

-- Crear tabla Estadisticas_Individuales
CREATE TABLE Estadisticas_Individuales (
    id_estadistica SERIAL PRIMARY KEY,
    id_jugador INTEGER REFERENCES Jugadores(id_jugador),
    id_partido INTEGER REFERENCES Partidos(id_partido),
    goles INTEGER DEFAULT 0,
    asistencias INTEGER DEFAULT 0,
    tarjetas_amarillas INTEGER DEFAULT 0,
    tarjetas_rojas INTEGER DEFAULT 0,
    mejor_jugador BOOLEAN DEFAULT false,
    minutos_jugados INTEGER CHECK (minutos_jugados >= 0 AND minutos_jugados <= 90),
    UNIQUE(id_jugador, id_partido)
);

-- Crear tabla Estadisticas_Equipo
CREATE TABLE Estadisticas_Equipo (
    id_estadistica_equipo SERIAL PRIMARY KEY,
    id_equipo INTEGER REFERENCES Equipos(id_equipo),
    id_partido INTEGER REFERENCES Partidos(id_partido),
    goles INTEGER DEFAULT 0,
    tarjetas_amarillas INTEGER DEFAULT 0,
    tarjetas_rojas INTEGER DEFAULT 0,
    UNIQUE(id_equipo, id_partido)
);

-- Crear tabla Logros
CREATE TABLE Logros (
    id_logro SERIAL PRIMARY KEY,
    nombre_logro VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL
);

-- Crear tabla Logros_Desbloqueados
CREATE TABLE Logros_Desbloqueados (
    id_logro_desbloqueado SERIAL PRIMARY KEY,
    id_jugador INTEGER REFERENCES Jugadores(id_jugador),
    id_logro INTEGER REFERENCES Logros(id_logro),
    fecha_desbloqueo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_jugador, id_logro)
);
