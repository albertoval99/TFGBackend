CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (
        rol IN (
            'administrador',
            'entrenador',
            'jugador',
            'arbitro'
        )
    ) NOT NULL,
    telefono VARCHAR(20),
    foto VARCHAR(255)
);

CREATE TABLE Administradores (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario)
);

CREATE TABLE Entrenadores (
    id_entrenador SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_equipo INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario),
    FOREIGN KEY (id_equipo) REFERENCES Equipos (id_equipo)
);

CREATE TABLE Jugadores (
    id_jugador SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_equipo INTEGER,
    posicion VARCHAR(50) NOT NULL,
    numero_camiseta INTEGER UNIQUE,
    activo BOOLEAN DEFAULT true,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario),
    FOREIGN KEY (id_equipo) REFERENCES Equipos (id_equipo)
);

CREATE TABLE Arbitros (
    id_arbitro SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id_usuario)
);

CREATE TABLE Ligas (
    id_liga SERIAL PRIMARY KEY,
    nombre_liga VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    temporada VARCHAR(20) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre_equipo VARCHAR(100) NOT NULL,
    id_liga INTEGER NOT NULL,
    escudo VARCHAR(255) NOT NULL,
    UNIQUE (nombre_equipo, id_liga),
    FOREIGN KEY (id_liga) REFERENCES Ligas (id_liga)
);

CREATE TABLE Partidos (
    id_partido SERIAL PRIMARY KEY,
    fecha_partido DATE NOT NULL,
    hora_partido TIME NOT NULL,
    equipo_local_id INTEGER NOT NULL,
    equipo_visitante_id INTEGER NOT NULL,
    resultado VARCHAR(10),
    ubicacion VARCHAR(100) NOT NULL,
    id_arbitro INTEGER,
    id_liga INTEGER,
    jornada INTEGER NOT NULL,
    FOREIGN KEY (equipo_local_id) REFERENCES Equipos(id_equipo),
    FOREIGN KEY (equipo_visitante_id) REFERENCES Equipos(id_equipo),
    FOREIGN KEY (id_liga) REFERENCES Ligas(id_liga)
    FOREIGN KEY (id_arbitro) REFERENCES Arbitros(id_arbitro);

);

CREATE TABLE Entrenamientos (
    id_entrenamiento SERIAL PRIMARY KEY,
    fecha_hora_entrenamiento TIMESTAMP NOT NULL,
    id_equipo INTEGER NOT NULL,
    duracion INTEGER NOT NULL CHECK (duracion > 0),
    FOREIGN KEY (id_equipo) REFERENCES Equipos (id_equipo)
);

CREATE TABLE Asistencias (
    id_asistencia SERIAL PRIMARY KEY,
    id_entrenamiento INTEGER NOT NULL,
    id_jugador INTEGER NOT NULL,
    asistio BOOLEAN NOT NULL DEFAULT false,
    justificacion TEXT,
    UNIQUE (id_entrenamiento, id_jugador),
    FOREIGN KEY (id_entrenamiento) REFERENCES Entrenamientos (id_entrenamiento),
    FOREIGN KEY (id_jugador) REFERENCES Jugadores (id_jugador)
);

CREATE TABLE Estadisticas_Individuales (
    id_estadistica SERIAL PRIMARY KEY,
    id_jugador INTEGER NOT NULL,
    id_partido INTEGER NOT NULL,
    goles INTEGER DEFAULT 0,
    asistencias INTEGER DEFAULT 0,
    tarjetas_amarillas INTEGER DEFAULT 0,
    tarjetas_rojas INTEGER DEFAULT 0,
    mejor_jugador BOOLEAN DEFAULT false,
    minutos_jugados INTEGER CHECK (
        minutos_jugados >= 0
        AND minutos_jugados <= 90
    ),
    UNIQUE (id_jugador, id_partido),
    FOREIGN KEY (id_jugador) REFERENCES Jugadores (id_jugador),
    FOREIGN KEY (id_partido) REFERENCES Partidos (id_partido)
);

CREATE TABLE Estadisticas_Equipo (
    id_estadistica_equipo SERIAL PRIMARY KEY,
    id_equipo INTEGER NOT NULL,
    id_partido INTEGER NOT NULL,
    goles INTEGER DEFAULT 0,
    tarjetas_amarillas INTEGER DEFAULT 0,
    tarjetas_rojas INTEGER DEFAULT 0,
    UNIQUE (id_equipo, id_partido),
    FOREIGN KEY (id_equipo) REFERENCES Equipos (id_equipo),
    FOREIGN KEY (id_partido) REFERENCES Partidos (id_partido)
);

CREATE TABLE Logros (
    id_logro SERIAL PRIMARY KEY,
    nombre_logro VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    imagen TEXT NOT NULL
);

CREATE TABLE Logros_Desbloqueados (
    id_logro_desbloqueado SERIAL PRIMARY KEY,
    id_jugador INTEGER NOT NULL,
    id_logro INTEGER NOT NULL,
    fecha_desbloqueo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_jugador, id_logro),
    FOREIGN KEY (id_jugador) REFERENCES Jugadores (id_jugador),
    FOREIGN KEY (id_logro) REFERENCES Logros (id_logro)
);