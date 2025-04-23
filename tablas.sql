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
    telefono VARCHAR(20)
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
    numero_camiseta INTEGER,
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

-- INSERTS DE LAS TABLAS --
-- EQUIPOS DE 2ªREG 2-1 --
INSERT INTO
    equipos (
        id_equipo,
        nombre_equipo,
        id_liga,
        escudo
    )
VALUES (
        4,
        'JUVENTUD ALMUDEVAR-AT.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/almudevar.jpg'
    ),
    (
        5,
        'SANTIAGO GRAÑEN-C.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/gra%C3%B1en.png'
    ),
    (
        6,
        'FRULA-A.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/frula.jpg'
    ),
    (
        7,
        'ALCALA DE GURREA-U.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/gurrea.jpg'
    ),
    (
        8,
        'ALTO ARA-C.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/alto_ara.png'
    ),
    (
        9,
        'HUESCA-S.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/huesca_sd.png'
    ),
    (
        10,
        'SAN JORGE C.F.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/sj.png'
    ),
    (
        11,
        'CASTEJON-C.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/castejon.jpg'
    ),
    (
        12,
        'PEÑAS SARIÑENA-C.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/sari%C3%B1ena.jpg'
    ),
    (
        13,
        'BOLEA-C.F.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/bolea.jpg'
    ),
    (
        14,
        'BUJARALOZ-C.D.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/bujaraloz.jpg'
    ),
    (
        15,
        'CARTUJA DE MONEGROS-C.F.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/cartuja.jpg'
    ),
    (
        16,
        'EL TEMPLE F.C.',
        3,
        'https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/temple.jpg'
    );

--Jugadores AT-ALMUDEVAR--
INSERT INTO
    Usuarios (
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        'Marcos',
        'Periz Samper',
        'mperizsamper3@gmail.com',
        '$2a$10$3TRHbu4bYEbI11CB6KB6r.N63QPAaeahFNDNy0qyKPjnDKgtDf/82',
        'jugador',
        '600000001'
    ),
    (
        'Jaime',
        'Lisa Samper',
        'jlisasamper4@gmail.com',
        '$2a$10$.Lf/PjQTv0ePGlRdKFq3TenjhvPqtv.wx8Nteys7r/0mZ4lhHl7iC',
        'jugador',
        '600000002'
    ),
    (
        'Leopoldo',
        'Carranza Fillat',
        'lcarranzafillat6@gmail.com',
        '$2a$10$KviE8cXCbmnHcMDuLNYz.enryhAsDIY5Lynz5Zbnur.o6lfDh4XX.',
        'jugador',
        '600000003'
    ),
    (
        'David',
        'Sos Avellanas',
        'dsosavellanas7@gmail.com',
        '$2a$10$d56fvU7KhMYUQp4YrXZ3F.K947OQQw60NNIUI3m7yGjqmF.biLcgC',
        'jugador',
        '600000004'
    ),
    (
        'Javier',
        'Campos Boto',
        'jcamposboto10@gmail.com',
        '$2a$10$EpmvPJWzxFi3PYNRWeWoAez.1X5/YNBhxWalDHdlHi9LF8CJel/8u',
        'jugador',
        '600000005'
    ),
    (
        'Pablo',
        'Tapia Ruiz',
        'ptapiaruiz12@gmail.com',
        '$2a$10$/NKjb.C/Bz9hhrRIN4xAO.MAC3l93b0ItUwliJGZoxxcHtNtQTOSW',
        'jugador',
        '600000006'
    ),
    (
        'Ivan',
        'Gabarre Casasin',
        'igabarrecasasin13@gmail.com',
        '$2a$10$MIeGgMYXWrnvvu9vJoSn2OYWfhfOQtcPhP1v1LOIRyiSJjoT0aywC',
        'jugador',
        '600000007'
    ),
    (
        'Santiago',
        'Sanchidrían Puyoles',
        'ssanchidr​ian14@gmail.com',
        '$2a$10$vt91CPizV4I13w1LZymY4Oan0NWjhzey.z0ppcl2XaHg98EyF/J5O',
        'jugador',
        '600000008'
    ),
    (
        'Jaime',
        'Lasierr­a Alastrúe',
        'jlasierraalastrue18@gmail.com',
        '$2a$10$f1.2xoLphwnW74YljF9Gr.MJkzUESMpukt/ppjcULi0goR0RkkAWy',
        'jugador',
        '600000009'
    ),
    (
        'Ruben',
        'Ara Val',
        'raraval19@gmail.com',
        '$2a$10$9AYzqh6YecfoettBphQX8e3IrGHgsLzQEvrHZzTYmaMCQ5tT6n3Ua',
        'jugador',
        '600000010'
    ),
    (
        'Alberto',
        'Val Abad',
        'avalabad22@gmail.com',
        '$2a$10$y5FklwTQOLMijZ0wqq065es/l0j7SSHm0fefy571HQ/RuMzq1Fnoy',
        'jugador',
        '600000011'
    ),
    (
        'Sergio',
        'Hernandez Roman',
        'shernandezroman1@gmail.com',
        '$2a$10$46LLssliyj95N/9EJGo7hede8Z2OjALHjX/Xa8hNoSLss.9nVit0G',
        'jugador',
        '600000012'
    ),
    (
        'Luis Manuel',
        'Serrano Gracia',
        'lserranogracia2@gmail.com',
        '$2a$10$iabeo9BqBeiuafIzC6QQ0eR3cL.8eFjy8UZgjV9x.A1clmhTInnsK',
        'jugador',
        '600000013'
    ),
    (
        'Aaron',
        'Leiva Berdun',
        'aleivaberdun8@gmail.com',
        '$2a$10$A0UM19wTRxW3jqJYelFRu.0XyPSOPe7AcKiTVbxaKCBvB13nU.kb2',
        'jugador',
        '600000014'
    ),
    (
        'Mohamed',
        'Triai',
        'mtriai11@gmail.com',
        '$2a$10$obXw6A2mJVuSFHAzTrHi9egFMJknFpf/R2jYacwf.6/VOi/pIM2H6',
        'jugador',
        '600000015'
    ),
    (
        'Jorge',
        'Rubio Lacasta',
        'jrubiolacasta16@gmail.com',
        '$2a$10$BkGZ7xcdzBIZc05U1rNT9.7/mHO4h4GHNVxhhxDANNiZeF7pM3VNG',
        'jugador',
        '600000016'
    ),
    (
        'Diego',
        'Albendea Elfau',
        'dalbendeaelfau17@gmail.com',
        '$2a$10$Ql4R/g3XGJc08thQxb9XZ.3IZ8pMqzZp4gxe8M.7FUUYC2vYX/Ky6',
        'jugador',
        '600000017'
    ),
    (
        'Jose Miguel',
        'Rivares Alastruey',
        'jrivaresalastruey20@gmail.com',
        '$2a$10$2Iqu56SKz1UCljTqaxqrTuxZxVy/y1rmBxRyzxSr7/LhG4kI9yDkS',
        'jugador',
        '600000018'
    );

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (73, 4, 'LI', 3, true), -- Marcos Periz Samper
    (74, 4, 'DFC', 4, true), -- Jaime Lisa Samper
    (75, 4, 'MC', 6, true), -- Leopoldo Carranza Fillat
    (76, 4, 'DC', 7, true), -- David Sos Avellanas
    (77, 4, 'MC', 10, true), -- Javier Campos Boto
    (78, 4, 'MI', 12, true), -- Pablo Tapia Ruiz
    (79, 4, 'PT', 13, true), -- Ivan Gabarre Casasin
    (80, 4, 'MD', 14, true), -- Santiago Sanchidrían Puyoles
    (81, 4, 'LD', 18, true), -- Jaime Lasierr­a Alastrúe
    (82, 4, 'DFC', 19, true), -- Ruben Ara Val
    (83, 4, 'DC', 22, true), -- Alberto Val Abad
    -- Suplentes
    (84, 4, 'PT', 1, true), -- Sergio Hernandez Roman
    (85, 4, 'DFC', 2, true), -- Luis Manuel Serrano Gracia
    (86, 4, 'MC', 8, true), -- Aaron Leiva Berdun
    (87, 4, 'ED', 11, true), -- Mohamed Triai
    (88, 4, 'ED', 16, true), -- Jorge Rubio Lacasta
    (89, 4, 'LD', 17, true), -- Diego Albendea Elfau
    (90, 4, 'EI', 20, true) -- Jose Miguel Rivares Alastruey
;

-- JUGADORES GRAÑEN --
INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        91,
        'IKER',
        'ANIES LIDON',
        'ianieslidon1@gmail.com',
        'ianieslidon1@gmail.com',
        'jugador',
        '600000001'
    ), -- ANIES LIDON, IKER
    (
        92,
        'ALEJANDRO',
        'MARTIN ANORO',
        'amartinanoro2@gmail.com',
        'amartinanoro2@gmail.com',
        'jugador',
        '600000002'
    ), -- MARTIN ANORO, ALEJANDRO
    (
        93,
        'IVAN',
        'ORIOL GRACIA',
        'ioriolgracia3@gmail.com',
        'ioriolgracia3@gmail.com',
        'jugador',
        '600000003'
    ), -- ORIOL GRACIA, IVAN
    (
        94,
        'ANDRES',
        'GARCIA AYUDA',
        'agarciaayuda5@gmail.com',
        'agarciaayuda5@gmail.com',
        'jugador',
        '600000004'
    ), -- GARCIA AYUDA, ANDRES
    (
        95,
        'HUGO',
        'ABOS GUTIERREZ',
        'habosgutierrez6@gmail.com',
        'habosgutierrez6@gmail.com',
        'jugador',
        '600000005'
    ), -- ABOS GUTIERREZ, HUGO
    (
        96,
        'SAMUEL',
        'IRANZO MARTIN',
        'siranzomartin7@gmail.com',
        'siranzomartin7@gmail.com',
        'jugador',
        '600000006'
    ), -- IRANZO MARTIN, SAMUEL
    (
        97,
        'FERNANDO',
        'ESCARIO MUZAS',
        'fescariomuzas9@gmail.com',
        'fescariomuzas9@gmail.com',
        'jugador',
        '600000007'
    ), -- ESCARIO MUZAS, FERNANDO
    (
        98,
        'MARC',
        'ROMAN MILANS',
        'mromanmilans11@gmail.com',
        'mromanmilans11@gmail.com',
        'jugador',
        '600000008'
    ), -- ROMAN MILANS, MARC
    (
        99,
        'AYOUB',
        'EL HOUNAINI',
        'aelhounaini14@gmail.com',
        'aelhounaini14@gmail.com',
        'jugador',
        '600000009'
    ), -- EL HOUNAINI, AYOUB
    (
        100,
        'SORIN SANDU',
        'GROSU',
        'sgrosu18@gmail.com',
        'sgrosu18@gmail.com',
        'jugador',
        '600000010'
    ), -- GROSU, SORIN SANDU
    (
        101,
        'JAIRO',
        'GALLARDO SANTIN',
        'jgallardosantin21@gmail.com',
        'jgallardosantin21@gmail.com',
        'jugador',
        '600000011'
    ), -- GALLARDO SANTIN, JAIRO
    (
        102,
        'IKER',
        'ABADIA OBON',
        'iabadiaobon8@gmail.com',
        'iabadiaobon8@gmail.com',
        'jugador',
        '600000012'
    ), -- ABADIA OBON, IKER
    (
        103,
        'AARON',
        'HERRERO MOREDa',
        'aherreromoreda12@gmail.com',
        'aherreromoreda12@gmail.com',
        'jugador',
        '600000013'
    ), -- HERRERO MOREDa, AARON
    (
        104,
        'BORJA',
        'DUERTO SALINAS',
        'bduertosalinas15@gmail.com',
        'bduertosalinas15@gmail.com',
        'jugador',
        '600000014'
    ), -- DUERTO SALINAS, BORJA
    (
        105,
        'IMAD',
        'MOUTAOUAKIL ELOBBADI',
        'imoutaouakilelobbadi16@gmail.com',
        'imoutaouakilelobbadi16@gmail.com',
        'jugador',
        '600000015'
    ), -- MOUTAOUAKIL ELOBBADI, IMAD
    (
        106,
        'YOUSSEF',
        'EL AHMAR',
        'yelahmar19@gmail.com',
        'yelahmar19@gmail.com',
        'jugador',
        '600000016'
    ), -- EL AHMAR, YOUSSEF
    (
        107,
        'MOHAMED',
        'GARTI KHANDOUR',
        'mgartikhandour22@gmail.com',
        'mgartikhandour22@gmail.com',
        'jugador',
        '600000017'
    );
-- GARTI KHANDOUR, MOHAMED

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (91, 5, 'PT', 1, true), -- ANIES LIDON, IKER
    (92, 5, 'DFC', 2, true), -- MARTIN ANORO, ALEJANDRO
    (93, 5, 'LI', 3, true), -- ORIOL GRACIA, IVAN
    (94, 5, 'DFC', 5, true), -- GARCIA AYUDA, ANDRES
    (95, 5, 'MC', 6, true), -- ABOS GUTIERREZ, HUGO
    (96, 5, 'DC', 7, true), -- IRANZO MARTIN, SAMUEL
    (97, 5, 'DC', 9, true), -- ESCARIO MUZAS, FERNANDO
    (98, 5, 'ED', 11, true), -- ROMAN MILANS, MARC
    (99, 5, 'MI', 12, true), -- EL HOUNAINI, AYOUB
    (100, 5, 'MD', 14, true), -- GROSU, SORIN SANDU
    (101, 5, 'EI', 21, true), -- GALLARDO SANTIN, JAIRO
    -- Suplentes
    (102, 5, 'MC', 8, true), -- ABADIA OBON, IKER
    (103, 5, 'MC', 12, true), -- HERRERO MOREDa, AARON
    (104, 5, 'MC', 15, true), -- DUERTO SALINAS, BORJA
    (105, 5, 'ED', 16, true), -- MOUTAOUAKIL ELOBBADI, IMAD
    (106, 5, 'DFC', 19, true), -- EL AHMAR, YOUSSEF
    (107, 5, 'DC', 22, true);
-- GARTI KHANDOUR, MOHAMED

-- JUGADORES FRULA --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        108,
        'ALEJANDRO',
        'ROCHE BETORE',
        'arochebetore1@gmail.com',
        'arochebetore1@gmail.com',
        'jugador',
        '600000018'
    ), -- ROCHE BETORE, ALEJANDRO
    (
        109,
        'SOFIAN',
        'BEN MASOUD LYAZIDI',
        'sbenmasoudlyazidi2@gmail.com',
        'sbenmasoudlyazidi2@gmail.com',
        'jugador',
        '600000019'
    ), -- BEN MASOUD LYAZIDI, SOFIAN
    (
        110,
        'RAUL',
        'ALVIRA OLIVA',
        'ralviraoliva4@gmail.com',
        'ralviraoliva4@gmail.com',
        'jugador',
        '600000020'
    ), -- ALVIRA OLIVA, RAUL
    (
        111,
        'ALBERTO',
        'LORENZ ARJOL',
        'alorenzarjol5@gmail.com',
        'alorenzarjol5@gmail.com',
        'jugador',
        '600000021'
    ), -- LORENZ ARJOL, ALBERTO
    (
        112,
        'ANGEL',
        'MAZANA ARCAS',
        'amazanaarcas7@gmail.com',
        'amazanaarcas7@gmail.com',
        'jugador',
        '600000022'
    ), -- MAZANA ARCAS, ANGEL
    (
        113,
        'YOEL',
        'MONESMA ARRIETA',
        'ymonesmaarrieta8@gmail.com',
        'ymonesmaarrieta8@gmail.com',
        'jugador',
        '600000023'
    ), -- MONESMA ARRIETA, YOEL
    (
        114,
        'ZAKARIA',
        'FADLI DAOUI',
        'zfadlidaoui11@gmail.com',
        'zfadlidaoui11@gmail.com',
        'jugador',
        '600000024'
    ), -- FADLI DAOUI, ZAKARIA
    (
        115,
        'LUIS ENRIQUE',
        'NOBOA GUEVARA',
        'lnoboaguevara16@gmail.com',
        'lnoboaguevara16@gmail.com',
        'jugador',
        '600000025'
    ), -- NOBOA GUEVARA, LUIS ENRIQUE
    (
        116,
        'ALVARO',
        'GARRIS LOZANO',
        'agarrislozano17@gmail.com',
        'agarrislozano17@gmail.com',
        'jugador',
        '600000026'
    ), -- GARRIS LOZANO, ALVARO
    (
        117,
        'RAFAEL',
        'ARILLA CORVINOS',
        'rarillacorvinos22@gmail.com',
        'rarillacorvinos22@gmail.com',
        'jugador',
        '600000027'
    ), -- ARILLA CORVINOS, RAFAEL
    (
        118,
        'IKER',
        'MONESMA ARRIETA',
        'imonesmaarrieta23@gmail.com',
        'imonesmaarrieta23@gmail.com',
        'jugador',
        '600000028'
    ), -- MONESMA ARRIETA, IKER
    (
        119,
        'RUBEN',
        'LOZANO COTELA',
        'rlozanocotela13@gmail.com',
        'rlozanocotela13@gmail.com',
        'jugador',
        '600000029'
    ), -- LOZANO COTELA, RUBEN
    (
        120,
        'ABEL',
        'COTELA LABARTA',
        'acotelalabarta6@gmail.com',
        'acotelalabarta6@gmail.com',
        'jugador',
        '600000030'
    ), -- COTELA LABARTA, ABEL
    (
        121,
        'AARON',
        'CHUECA LABORDA',
        'achuecalaborda9@gmail.com',
        'achuecalaborda9@gmail.com',
        'jugador',
        '600000031'
    ), -- CHUECA LABORDA, AARON
    (
        122,
        'JESUS DARIO',
        'SIESO ENA',
        'jsiesoena18@gmail.com',
        'jsiesoena18@gmail.com',
        'jugador',
        '600000032'
    ), -- SIESO ENA, JESUS DARIO
    (
        123,
        'IMAD',
        'EL GHARABI ALLAL',
        'ielgharabiallall19@gmail.com',
        'ielgharabiallall19@gmail.com',
        'jugador',
        '600000033'
    ), -- EL GHARABI ALLAL, IMAD
    (
        124,
        'DAVID',
        'PEDROSA BENEDI',
        'dpedrosabenedi20@gmail.com',
        'dpedrosabenedi20@gmail.com',
        'jugador',
        '600000034'
    );
-- PEDROSA BENEDI, DAVID

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (108, 6, 'PT', 1, true), -- ROCHE BETORE, ALEJANDRO
    (109, 6, 'DFC', 2, true), -- BEN MASOUD LYAZIDI, SOFIAN
    (110, 6, 'LI', 4, true), -- ALVIRA OLIVA, RAUL
    (111, 6, 'DFC', 5, true), -- LORENZ ARJOL, ALBERTO
    (112, 6, 'DC', 7, true), -- MAZANA ARCAS, ANGEL
    (113, 6, 'MC', 8, true), -- MONESMA ARRIETA, YOEL
    (114, 6, 'ED', 11, true), -- FADLI DAOUI, ZAKARIA
    (115, 6, 'ED', 16, true), -- NOBOA GUEVARA, LUIS ENRIQUE
    (116, 6, 'LD', 17, true), -- GARRIS LOZANO, ALVARO
    (117, 6, 'DC', 22, true), -- ARILLA CORVINOS, RAFAEL
    (118, 6, 'EI', 23, true), -- MONESMA ARRIETA, IKER
    (119, 6, 'PT', 13, true), -- LOZANO COTELA, RUBEN
    (120, 6, 'MC', 6, true), -- COTELA LABARTA, ABEL
    (121, 6, 'DC', 9, true), -- CHUECA LABORDA, AARON
    (122, 6, 'LD', 18, true), -- SIESO ENA, JESUS DARIO
    (123, 6, 'DFC', 19, true), -- EL GHARABI ALLAL, IMAD
    (124, 6, 'EI', 20, true);
-- PEDROSA BENEDI, DAVID

-- JUGADORES GURREA --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        125,
        'AARON',
        'ANES ZABORRAS',
        'aaneszaborras1@gmail.com',
        'aaneszaborras1@gmail.com',
        'jugador',
        '600000035'
    ), -- ANES ZABORRAS, AARON
    (
        126,
        'ANDRES',
        'PALLARES TURO',
        'apallaresturo2@gmail.com',
        'apallaresturo2@gmail.com',
        'jugador',
        '600000036'
    ), -- PALLARES TURO, ANDRES
    (
        127,
        'MARIO',
        'TIL LATORRE',
        'mtillatorre3@gmail.com',
        'mtillatorre3@gmail.com',
        'jugador',
        '600000037'
    ), -- TIL LATORRE, MARIO
    (
        128,
        'URBEZ',
        'ABADIAS CLAVER',
        'uabadiasclaver4@gmail.com',
        'uabadiasclaver4@gmail.com',
        'jugador',
        '600000038'
    ), -- ABADIAS CLAVER, URBEZ
    (
        129,
        'HECTOR',
        'GONZALEZ HORNO',
        'hgonzalezhorno5@gmail.com',
        'hgonzalezhorno5@gmail.com',
        'jugador',
        '600000039'
    ), -- GONZALEZ HORNO, HECTOR
    (
        130,
        'ALEXANDRE ANDRIANTSOA',
        'RAKOTO',
        'arakoto6@gmail.com',
        'arakoto6@gmail.com',
        'jugador',
        '600000040'
    ), -- RAKOTO, ALEXANDRE ANDRIANTSOA
    (
        131,
        'ANGEL',
        'TOMAS IBARZ',
        'atomasibarz7@gmail.com',
        'atomasibarz7@gmail.com',
        'jugador',
        '600000041'
    ), -- TOMAS IBARZ, ANGEL
    (
        132,
        'ISMAEL PEGUEDWENDE',
        'SAWADOGO KARGOUGOU',
        'isawadogokargougou8@gmail.com',
        'isawadogokargougou8@gmail.com',
        'jugador',
        '600000042'
    ), -- SAWADOGO KARGOUGOU, ISMAEL PEGUEDWENDE
    (
        133,
        'HUGO',
        'ANES ZABORRAS',
        'haneszaborras9@gmail.com',
        'haneszaborras9@gmail.com',
        'jugador',
        '600000043'
    ), -- ANES ZABORRAS, HUGO
    (
        134,
        'SERGIO',
        'ANIES SERAL',
        'saniesseral10@gmail.com',
        'saniesseral10@gmail.com',
        'jugador',
        '600000044'
    ), -- ANIES SERAL, SERGIO
    (
        135,
        'RUBEN',
        'LATRE VILLACAMPA',
        'rlatrevillacampa11@gmail.com',
        'rlatrevillacampa11@gmail.com',
        'jugador',
        '600000045'
    ), -- LATRE VILLACAMPA, RUBEN
    (
        136,
        'BRUNO JOSE',
        'SARASA CAMPO',
        'bsarasacampo12@gmail.com',
        'bsarasacampo12@gmail.com',
        'jugador',
        '600000046'
    ), -- SARASA CAMPO, BRUNO JOSE
    (
        137,
        'JON',
        'GONZALEZ RODRIGUEZ',
        'jgonzalezrodriguez14@gmail.com',
        'jgonzalezrodriguez14@gmail.com',
        'jugador',
        '600000047'
    ), -- GONZALEZ RODRIGUEZ, JON
    (
        138,
        'MARIO',
        'BEGUE CAYERO',
        'mbeguecayero15@gmail.com',
        'mbeguecayero15@gmail.com',
        'jugador',
        '600000048'
    );
-- BEGUE CAYERo, MARIO

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (125, 7, 'PT', 1, true), -- ANES ZABORRAS, AARON
    (126, 7, 'DFC', 2, true), -- PALLARES TURO, ANDRES
    (127, 7, 'LI', 3, true), -- TIL LATORRE, MARIO
    (128, 7, 'DFC', 4, true), -- ABADIAS CLAVER, URBEZ
    (129, 7, 'DFC', 5, true), -- GONZALEZ HORNO, HECTOR
    (130, 7, 'MC', 6, true), -- RAKOTO, ALEXANDRE ANDRIANTSOA
    (131, 7, 'DC', 7, true), -- TOMAS IBARZ, ANGEL
    (132, 7, 'MC', 8, true), -- SAWADOGO KARGOUGOU, ISMAEL PEGUEDWENDE
    (133, 7, 'DC', 9, true), -- ANES ZABORRAS, HUGO
    (134, 7, 'EI', 10, true), -- ANIES SERAL, SERGIO
    (135, 7, 'ED', 11, true), -- LATRE VILLACAMPA, RUBEN
    (136, 7, 'MI', 12, true), -- SARASA CAMPO, BRUNO JOSE
    (137, 7, 'MD', 14, true), -- GONZALEZ RODRIGUEZ, JON
    (138, 7, 'MC', 15, true);
-- BEGUE CAYERo, MARIO

-- JUGADORES  ALTO ARA --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        139,
        'DANIEL',
        'ROYO FRAILE',
        'droyofraile13@gmail.com',
        'droyofraile13@gmail.com',
        'jugador',
        '600000049'
    ), -- 13
    (
        140,
        'SERGIO',
        'FELICES ORNAT',
        'sfelicesornat3@gmail.com',
        'sfelicesornat3@gmail.com',
        'jugador',
        '600000050'
    ), -- 3
    (
        141,
        'ANTONIO MIGUEL',
        'GALLEGO BORREGUERO',
        'agalegoborreguero7@gmail.com',
        'agalegoborreguero7@gmail.com',
        'jugador',
        '600000051'
    ), -- 7
    (
        142,
        'MARTIN',
        'DUASO MARTINEZ',
        'mduasomartinez8@gmail.com',
        'mduasomartinez8@gmail.com',
        'jugador',
        '600000052'
    ), -- 8
    (
        143,
        'RUBEN',
        'GOMEZ BOSQUE',
        'rgomezbosque9@gmail.com',
        'rgomezbosque9@gmail.com',
        'jugador',
        '600000053'
    ), -- 9
    (
        144,
        'CARLOS',
        'BORRA SOLANO',
        'cborrasolano11@gmail.com',
        'cborrasolano11@gmail.com',
        'jugador',
        '600000054'
    ), -- 11
    (
        145,
        'JHON JAIRO',
        'RAMIREZ LOPEZ',
        'jramirezlopez12@gmail.com',
        'jramirezlopez12@gmail.com',
        'jugador',
        '600000055'
    ), -- 12
    (
        146,
        'JUAN',
        'BORRA SOLANO',
        'jborrasolano19@gmail.com',
        'jborrasolano19@gmail.com',
        'jugador',
        '600000056'
    ), -- 19
    (
        147,
        'OSCAR',
        'VILLACAMPA RIAZUELO',
        'ovillacampariazuelo23@gmail.com',
        'ovillacampariazuelo23@gmail.com',
        'jugador',
        '600000057'
    ), -- 23
    (
        148,
        'SERGIO',
        'VILLACAMPA RIAZUELO',
        'svillacampariazuelo24@gmail.com',
        'svillacampariazuelo24@gmail.com',
        'jugador',
        '600000058'
    ), -- 24
    (
        149,
        'DIEGO',
        'SAMPIETRO BARDAJI',
        'dsampietrobardaji26@gmail.com',
        'dsampietrobardaji26@gmail.com',
        'jugador',
        '600000059'
    ), -- 26
    (
        150,
        'JERÓNIMO',
        'GONZALO SANTOS',
        'jgonzalosantos1@gmail.com',
        'jgonzalosantos1@gmail.com',
        'jugador',
        '600000060'
    ), -- 1
    (
        151,
        'MARIO',
        'SANZ CARNICERO',
        'msanzcarnicero5@gmail.com',
        'msanzcarnicero5@gmail.com',
        'jugador',
        '600000061'
    ), -- 5
    (
        152,
        'LUCAS',
        'ALLUÉ TOMÁS',
        'lalluetomas14@gmail.com',
        'lalluetomas14@gmail.com',
        'jugador',
        '600000062'
    );
-- 14 -- 14

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (139, 8, 'PT', 13, true), -- ROYO FRAILE, DANIEL
    (140, 8, 'LI', 3, true), -- FELICES ORNAT, SERGIO
    (141, 8, 'DC', 7, true), -- GALLEGO BORREGUERO, ANTONIO MIGUEL
    (142, 8, 'MC', 8, true), -- DUASO MARTINEZ, MARTIN
    (143, 8, 'DC', 9, true), -- GOMEZ BOSQUE, RUBEN
    (144, 8, 'ED', 11, true), -- BORRA SOLANO, CARLOS
    (145, 8, 'MI', 12, true), -- RAMIREZ LOPEZ, JHON JAIRO
    (146, 8, 'DFC', 19, true), -- BORRA SOLANO, JUAN
    (147, 8, 'EI', 23, true), -- VILLACAMPA RIAZUELO, OSCAR
    (148, 8, 'LD', 24, true), -- VILLACAMPA RIAZUELO, SERGIO
    (149, 8, 'MC', 26, true), -- SAMPIETRO BARDAJI, DIEGO
    (150, 8, 'PT', 1, true), -- GONZALO SANTOS, JERÓNIMO
    (151, 8, 'DFC', 5, true), -- SANZ CARNICERO, MARIO
    (152, 8, 'MD', 14, true);
-- ALLUÉ TOMÁS, LUCAS

-- JUGADORES  huesca --
INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        153,
        'ISMAIL',
        'SUHAYB',
        'isuhayb1@gmail.com',
        'isuhayb1@gmail.com',
        'jugador',
        '600000063'
    ), -- 1
    (
        154,
        'DAVID',
        'PORLAN BARDAJI',
        'dporlanbardaji2@gmail.com',
        'dporlanbardaji2@gmail.com',
        'jugador',
        '600000064'
    ), -- 2
    (
        155,
        'ELIAS MATTI MUSONDA',
        'MUTALE',
        'emutale3@gmail.com',
        'emutale3@gmail.com',
        'jugador',
        '600000065'
    ), -- 3
    (
        156,
        'IVAN',
        'PASCUAL LOPEZ',
        'ipascuallopez6@gmail.com',
        'ipascuallopez6@gmail.com',
        'jugador',
        '600000066'
    ), -- 6
    (
        157,
        'JULEN',
        'ARAUS GONZALEZ',
        'jarausgonzalez7@gmail.com',
        'jarausgonzalez7@gmail.com',
        'jugador',
        '600000067'
    ), -- 7
    (
        158,
        'CHASE LAWRENCE',
        'KENNEDY',
        'ckennedy8@gmail.com',
        'ckennedy8@gmail.com',
        'jugador',
        '600000068'
    ), -- 8
    (
        159,
        'TITUS NATHAN',
        'WRIGHT',
        'twright9@gmail.com',
        'twright9@gmail.com',
        'jugador',
        '600000069'
    ), -- 9
    (
        160,
        'ILIA',
        'TANCHEV',
        'itanchev10@gmail.com',
        'itanchev10@gmail.com',
        'jugador',
        '600000070'
    ), -- 10
    (
        161,
        'MIGUEL',
        'PUENTE TERRERO',
        'mpuenteterrero11@gmail.com',
        'mpuenteterrero11@gmail.com',
        'jugador',
        '600000071'
    ), -- 11
    (
        162,
        'FERNANDO',
        'JIMENEZ MARTIN',
        'fjimenezmartin12@gmail.com',
        'fjimenezmartin12@gmail.com',
        'jugador',
        '600000072'
    ), -- 12
    (
        163,
        'BRYAN OSWALDO',
        'POROJ MORALES',
        'bporojmorales14@gmail.com',
        'bporojmorales14@gmail.com',
        'jugador',
        '600000073'
    ), -- 14
    (
        164,
        'ALBERT',
        'DOMINGO I RAMI',
        'adomingoirami15@gmail.com',
        'adomingoirami15@gmail.com',
        'jugador',
        '600000074'
    ), -- 15
    (
        165,
        'NIDAL',
        'BELAHBIB EL HARRAK',
        'nbelahbibelharrak17@gmail.com',
        'nbelahbibelharrak17@gmail.com',
        'jugador',
        '600000075'
    ), -- 17
    (
        166,
        'PABLO',
        'SANROMAN OLIVARI',
        'psanromanolivari19@gmail.com',
        'psanromanolivari19@gmail.com',
        'jugador',
        '600000076'
    ), -- 19
    (
        167,
        'NICOLAS',
        'LOPEZ HIGUERAS',
        'nlopezhigueras26@gmail.com',
        'nlopezhigueras26@gmail.com',
        'jugador',
        '600000077'
    );
-- 26

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (153, 9, 'PT', 1, true), -- SUHAYB, ISMAIL
    (154, 9, 'DFC', 2, true), -- PORLAN BARDAJI, DAVID
    (155, 9, 'LI', 3, true), -- MUTALE, ELIAS MATTI MUSONDA
    (156, 9, 'MC', 6, true), -- PASCUAL LOPEZ, IVAN
    (157, 9, 'DC', 7, true), -- ARAUS GONZALEZ, JULEN
    (158, 9, 'MC', 8, true), -- KENNEDY, CHASE LAWRENCE
    (159, 9, 'DC', 9, true), -- WRIGHT, TITUS NATHAN
    (160, 9, 'EI', 10, true), -- TANCHEV, ILIA
    (161, 9, 'ED', 11, true), -- PUENTE TERRERO, MIGUEL
    (162, 9, 'MI', 12, true), -- JIMENEZ MARTIN, FERNANDO
    (163, 9, 'MD', 14, true), -- POROJ MORALES, BRYAN OSWALDO
    (164, 9, 'MC', 15, true), -- DOMINGO I RAMI, ALBERT
    (165, 9, 'LD', 17, true), -- BELAHBIB EL HARRAK, NIDAL
    (166, 9, 'DFC', 19, true), -- SANROMAN OLIVARI, PABLO
    (167, 9, 'MC', 26, true);
-- LOPEZ HIGUERAS, NICOLAS

-- JUGADORES  SAN JORGE --
INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        168,
        'GEORGIAN',
        'ROMILA',
        'gromila93@gmail.com',
        'gromila93@gmail.com',
        'jugador',
        '600000078'
    ), -- 93
    (
        169,
        'MIROSLAV NIKOLAEV',
        'KOSTOV',
        'mkostov3@gmail.com',
        'mkostov3@gmail.com',
        'jugador',
        '600000079'
    ), -- 3
    (
        170,
        'ALEXANDRU MIHAI',
        'BUTAN',
        'abutan5@gmail.com',
        'abutan5@gmail.com',
        'jugador',
        '600000080'
    ), -- 5
    (
        171,
        'ABDOU WAHAB',
        'JALLOW',
        'ajallow6@gmail.com',
        'ajallow6@gmail.com',
        'jugador',
        '600000081'
    ), -- 6
    (
        172,
        'DANIEL',
        'SIERRA CEBRIAN',
        'dsierracebrian7@gmail.com',
        'dsierracebrian7@gmail.com',
        'jugador',
        '600000082'
    ), -- 7
    (
        173,
        'MIGUEL JOAO',
        'RAMOS CHORAO',
        'mramoschorao8@gmail.com',
        'mramoschorao8@gmail.com',
        'jugador',
        '600000083'
    ), -- 8
    (
        174,
        'ANGEL LUIS',
        'HERRANZ SIERRA',
        'aherranzsierra10@gmail.com',
        'aherranzsierra10@gmail.com',
        'jugador',
        '600000084'
    ), -- 10
    (
        175,
        'MAMADOU SELLOU',
        'DIALLO',
        'mdiallo12@gmail.com',
        'mdiallo12@gmail.com',
        'jugador',
        '600000085'
    ), -- 12
    (
        176,
        'DIEGO',
        'PEREZ PUYALTO',
        'dperezpuyalto14@gmail.com',
        'dperezpuyalto14@gmail.com',
        'jugador',
        '600000086'
    ), -- 14
    (
        177,
        'GONZALO',
        'REULA FUMANAL',
        'greulafumanal15@gmail.com',
        'greulafumanal15@gmail.com',
        'jugador',
        '600000087'
    ), -- 15
    (
        178,
        'GUILLERMO',
        'ARIZON GIMENEZ',
        'garizongimenez16@gmail.com',
        'garizongimenez16@gmail.com',
        'jugador',
        '600000088'
    ), -- 16
    (
        179,
        'ALHOUSSEINY',
        'DIALLO SOUARE',
        'adiallosouare17@gmail.com',
        'adiallosouare17@gmail.com',
        'jugador',
        '600000089'
    ), -- 17
    (
        180,
        'FERMIN',
        'LOPEZ TRONCOSO',
        'flopeztroncoso20@gmail.com',
        'flopeztroncoso20@gmail.com',
        'jugador',
        '600000090'
    ), -- 20
    (
        181,
        'OSCAR',
        'ESCARIO ABIO',
        'oescarioabio21@gmail.com',
        'oescarioabio21@gmail.com',
        'jugador',
        '600000091'
    ), -- 21
    (
        182,
        'MARCOS',
        'LOPEZ CEBRIAN',
        'mlopezcebrian22@gmail.com',
        'mlopezcebrian22@gmail.com',
        'jugador',
        '600000092'
    ), -- 22
    (
        183,
        'DIEGO',
        'LACARTE AZNAR',
        'dlacarteaznar23@gmail.com',
        'dlacarteaznar23@gmail.com',
        'jugador',
        '600000093'
    );
-- 23

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (168, 10, 'PT', 93, true), -- ROMILA, GEORGIAN
    (169, 10, 'LI', 3, true), -- KOSTOV, MIROSLAV NIKOLAEV
    (170, 10, 'DFC', 5, true), -- BUTAN, ALEXANDRU MIHAI
    (171, 10, 'MC', 6, true), -- JALLOW, ABDOU WAHAB
    (172, 10, 'DC', 7, true), -- SIERRA CEBRIAN, DANIEL
    (173, 10, 'MC', 8, true), -- RAMOS CHORAO, MIGUEL JOAO
    (174, 10, 'EI', 10, true), -- HERRANZ SIERRA, ANGEL LUIS
    (175, 10, 'MI', 12, true), -- DIALLO, MAMADOU SELLOU
    (176, 10, 'MD', 14, true), -- PEREZ PUYALTO, DIEGO
    (177, 10, 'MC', 15, true), -- REULA FUMANAL, GONZALO
    (178, 10, 'ED', 16, true), -- ARIZON GIMENEZ, GUILLERMO
    (179, 10, 'LD', 17, true), -- DIALLO SOUARE, ALHOUSSEINY
    (180, 10, 'EI', 20, true), -- LOPEZ TRONCOSO, FERMIN
    (181, 10, 'DFC', 21, true), -- ESCARIO ABIO, OSCAR
    (182, 10, 'DC', 22, true), -- LOPEZ CEBRIAN, MARCOS
    (183, 10, 'EI', 23, true);
-- LACARTE AZNAR, DIEGO

-- JUGADORES  castejon --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        184,
        'JAVIER',
        'CASTEJÓN BADIMON',
        'jcastejonbadimon1@gmail.com',
        'jcastejonbadimon1@gmail.com',
        'jugador',
        '600000094'
    ), -- 1
    (
        185,
        'JORGE',
        'CASTEJÓN BADIMÓN',
        'jcastejonbadimon3@gmail.com',
        'jcastejonbadimon3@gmail.com',
        'jugador',
        '600000095'
    ), -- 3
    (
        186,
        'PABLO',
        'CASTEJON HUYNH',
        'pcastejonhuynh4@gmail.com',
        'pcastejonhuynh4@gmail.com',
        'jugador',
        '600000096'
    ), -- 4
    (
        187,
        'BORJA S',
        'SERRATE ROSES',
        'bserrateroses5@gmail.com',
        'bserrateroses5@gmail.com',
        'jugador',
        '600000097'
    ), -- 5
    (
        188,
        'ALEJANDRO',
        'AINOZA SERRATE',
        'aainozaserrate6@gmail.com',
        'aainozaserrate6@gmail.com',
        'jugador',
        '600000098'
    ), -- 6
    (
        189,
        'DIEGO',
        'EZQUERRA MALLEN',
        'dezquerramallen7@gmail.com',
        'dezquerramallen7@gmail.com',
        'jugador',
        '600000099'
    ), -- 7
    (
        190,
        'JAVIER',
        'BUIL CAMPOS',
        'jbuilcampos8@gmail.com',
        'jbuilcampos8@gmail.com',
        'jugador',
        '600000100'
    ), -- 8
    (
        191,
        'HUGO',
        'SERRATE ROSES',
        'hserrateroses9@gmail.com',
        'hserrateroses9@gmail.com',
        'jugador',
        '600000101'
    ), -- 9
    (
        192,
        'ROMAN',
        'MORON LUPON',
        'rmoronlupon11@gmail.com',
        'rmoronlupon11@gmail.com',
        'jugador',
        '600000102'
    ), -- 11
    (
        193,
        'SAMUEL',
        'LUPON ABADIA',
        'sluponabadia13@gmail.com',
        'sluponabadia13@gmail.com',
        'jugador',
        '600000103'
    ), -- 13
    (
        194,
        'DARIO',
        'PUEYO SERRATE',
        'dpueyoserrate15@gmail.com',
        'dpueyoserrate15@gmail.com',
        'jugador',
        '600000104'
    ), -- 15
    (
        195,
        'JAVIER',
        'ASIN PALLAS',
        'jasinpallas17@gmail.com',
        'jasinpallas17@gmail.com',
        'jugador',
        '600000105'
    ), -- 17
    (
        196,
        'MATEO',
        'GONZÁLEZ',
        'mgonzalez18@gmail.com',
        'mgonzalez18@gmail.com',
        'jugador',
        '600000106'
    ), -- 18
    (
        197,
        'MANUEL',
        'GONZÁLEZ',
        'mgonzalez20@gmail.com',
        'mgonzalez20@gmail.com',
        'jugador',
        '600000107'
    ), -- 20
    (
        198,
        'CRISTIAN',
        'LUZAN ASIN',
        'cluzanasin21@gmail.com',
        'cluzanasin21@gmail.com',
        'jugador',
        '600000108'
    ), -- 21
    (
        199,
        'RAUL',
        'RODES SALILLAS',
        'rrodessalillas22@gmail.com',
        'rrodessalillas22@gmail.com',
        'jugador',
        '600000109'
    );

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (184, 11, 'PT', 1, true), -- CASTEJÓN BADIMON, JAVIER
    (185, 11, 'LI', 3, true), -- CASTEJÓN BADIMÓN, JORGE
    (186, 11, 'DFC', 4, true), -- CASTEJON HUYNH, PABLO
    (187, 11, 'DFC', 5, true), -- SERRATE ROSES, BORJA S
    (188, 11, 'MC', 6, true), -- AINOZA SERRATE, ALEJANDRO
    (189, 11, 'DC', 7, true), -- EZQUERRA MALLEN, DIEGO
    (190, 11, 'MC', 8, true), -- BUIL CAMPOS, JAVIER
    (191, 11, 'DC', 9, true), -- SERRATE ROSES, HUGO
    (192, 11, 'ED', 11, true), -- MORON LUPON, ROMAN
    (193, 11, 'PT', 13, true), -- LUPON ABADIA, SAMUEL
    (194, 11, 'MC', 15, true), -- PUEYO SERRATE, DARIO
    (195, 11, 'LD', 17, true), -- ASIN PALLAS, JAVIER
    (196, 11, 'DFC', 18, true), -- GONZÁLEZ, MATEO
    (197, 11, 'EI', 20, true), -- GONZÁLEZ, MANUEL
    (198, 11, 'EI', 21, true), -- LUZAN ASIN, CRISTIAN
    (199, 11, 'LD', 22, true);
-- RODES SALILLAS, RAUL -- 22

-- JUGADORES  sariñena --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        200,
        'ADRIAN',
        'PUEYO GUERRA',
        'apueyoguerra1@gmail.com',
        'apueyoguerra1@gmail.com',
        'jugador',
        '600000110'
    ), -- 1
    (
        201,
        'DAVID',
        'CEREZUELA MONTE',
        'dcerezuelamonte3@gmail.com',
        'dcerezuelamonte3@gmail.com',
        'jugador',
        '600000111'
    ), -- 3
    (
        202,
        'ALBERTO',
        'CALVO CALVETE',
        'acalvocalvete4@gmail.com',
        'acalvocalvete4@gmail.com',
        'jugador',
        '600000112'
    ), -- 4
    (
        203,
        'BELIAN FRANCISCO',
        'VILLELLAS PARALED',
        'bvillellasparaled5@gmail.com',
        'bvillellasparaled5@gmail.com',
        'jugador',
        '600000113'
    ), -- 5
    (
        204,
        'MIGUEL ANGEL',
        'GARCIA COBOS',
        'mgarciacobos6@gmail.com',
        'mgarciacobos6@gmail.com',
        'jugador',
        '600000114'
    ), -- 6
    (
        205,
        'ALEJANDRO CARLOS',
        'OCA ARMALE',
        'aocaarmale7@gmail.com',
        'aocaarmale7@gmail.com',
        'jugador',
        '600000115'
    ), -- 7
    (
        206,
        'MOSTAFA',
        'SAADOUNI KHALOUA',
        'msaadounikhaloua8@gmail.com',
        'msaadounikhaloua8@gmail.com',
        'jugador',
        '600000116'
    ), -- 8
    (
        207,
        'PABLO',
        'BENITO JAIME',
        'pbenitojaime9@gmail.com',
        'pbenitojaime9@gmail.com',
        'jugador',
        '600000117'
    ), -- 9
    (
        208,
        'MARCOS',
        'MAS CASIMIRO',
        'mmascasimiro10@gmail.com',
        'mmascasimiro10@gmail.com',
        'jugador',
        '600000118'
    ), -- 10
    (
        209,
        'SAMUEL',
        'PARALED ROYO',
        'sparaledroyo11@gmail.com',
        'sparaledroyo11@gmail.com',
        'jugador',
        '600000119'
    ), -- 11
    (
        210,
        'GERARD',
        'ABADIAS RUCHE',
        'gabadiasruche13@gmail.com',
        'gabadiasruche13@gmail.com',
        'jugador',
        '600000120'
    ), -- 13
    (
        211,
        'EMILIO',
        'SEGARRA YAGUE',
        'esegarrayague14@gmail.com',
        'esegarrayague14@gmail.com',
        'jugador',
        '600000121'
    ), -- 14
    (
        212,
        'PABLO',
        'GUILLEN BALASCH',
        'pguillenbalasch16@gmail.com',
        'pguillenbalasch16@gmail.com',
        'jugador',
        '600000122'
    ), -- 16
    (
        213,
        'DIDAC',
        'POZO MELIAN',
        'dpozomelian18@gmail.com',
        'dpozomelian18@gmail.com',
        'jugador',
        '600000123'
    ), -- 18
    (
        214,
        'AITOR',
        'POMAR PUYOL',
        'apomarpuyol21@gmail.com',
        'apomarpuyol21@gmail.com',
        'jugador',
        '600000124'
    ), -- 21
    (
        215,
        'DAVID',
        'PUYOL ABION',
        'dpuyolabion22@gmail.com',
        'dpuyolabion22@gmail.com',
        'jugador',
        '600000125'
    ), -- 22
    (
        216,
        'LUIS',
        'TARRAFETA ROYO',
        'ltarrafetaroyo28@gmail.com',
        'ltarrafetaroyo28@gmail.com',
        'jugador',
        '600000126'
    );
-- 28

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (200, 12, 'PT', 1, true), -- PUEYO GUERRA, ADRIAN
    (201, 12, 'LI', 3, true), -- CEREZUELA MONTE, DAVID
    (202, 12, 'DFC', 4, true), -- CALVO CALVETE, ALBERTO
    (203, 12, 'DFC', 5, true), -- VILLELLAS PARALED, BELIAN FRANCISCO
    (204, 12, 'MC', 6, true), -- GARCIA COBOS, MIGUEL ANGEL
    (205, 12, 'DC', 7, true), -- OCA ARMALE, ALEJANDRO CARLOS
    (206, 12, 'MC', 8, true), -- SAADOUNI KHALOUA, MOSTAFA
    (207, 12, 'DC', 9, true), -- BENITO JAIME, PABLO
    (208, 12, 'EI', 10, true), -- MAS CASIMIRO, MARCOS
    (209, 12, 'ED', 11, true), -- PARALED ROYO, SAMUEL
    (210, 12, 'PT', 13, true), -- ABADIAS RUCHE, GERARD
    (211, 12, 'MD', 14, true), -- SEGARRA YAGUE, EMILIO
    (212, 12, 'LD', 16, true), -- GUILLEN BALASCH, PABLO
    (213, 12, 'DFC', 18, true), -- POZO MELIAN, DIDAC
    (214, 12, 'EI', 21, true), -- POMAR PUYOL, AITOR
    (215, 12, 'LD', 22, true), -- PUYOL ABION, DAVID
    (216, 12, 'MC', 28, true);
-- TARRAFETA ROYO, LUIS

-- JUGADORES  bolea --

INSERT INTO
    Usuarios (
        id_usuario,
        nombre,
        apellidos,
        email,
        password,
        rol,
        telefono
    )
VALUES (
        217,
        'ERIC',
        'NOVO GARCÍA',
        'enovogarcia1@gmail.com',
        'enovogarcia1@gmail.com',
        'jugador',
        '600000127'
    ), -- 1
    (
        218,
        'MARCOS ALONSO',
        'OLIVAN IGLESIA',
        'molivaniglesia5@gmail.com',
        'molivaniglesia5@gmail.com',
        'jugador',
        '600000128'
    ), -- 5
    (
        219,
        'MARIO',
        'RUFAS CAMPO',
        'mrufascampo8@gmail.com',
        'mrufascampo8@gmail.com',
        'jugador',
        '600000129'
    ), -- 8
    (
        220,
        'CARLOS',
        'SANAGUSTIN ESCARIO',
        'csanagustinescario9@gmail.com',
        'csanagustinescario9@gmail.com',
        'jugador',
        '600000130'
    ), -- 9
    (
        221,
        'ALBERTO',
        'LAFUENTE ANIES',
        'alafuenteanies10@gmail.com',
        'alafuenteanies10@gmail.com',
        'jugador',
        '600000131'
    ), -- 10
    (
        222,
        'JAVIER',
        'CALVO LAIRLA',
        'jcalvolairla12@gmail.com',
        'jcalvolairla12@gmail.com',
        'jugador',
        '600000132'
    ), -- 12
    (
        223,
        'AITOR',
        'LANUZA LEON',
        'alanuzaleon13@gmail.com',
        'alanuzaleon13@gmail.com',
        'jugador',
        '600000133'
    ), -- 13
    (
        224,
        'JORGE',
        'UBICO MIRANDA',
        'jubicomiranda14@gmail.com',
        'jubicomiranda14@gmail.com',
        'jugador',
        '600000134'
    ), -- 14
    (
        225,
        'DIEGO',
        'HEREZA ESTEBAN',
        'dherezaesteban16@gmail.com',
        'dherezaesteban16@gmail.com',
        'jugador',
        '600000135'
    ), -- 16
    (
        226,
        'LORIEN',
        'OTAL VALDENEBRO',
        'lotalvaldenebro18@gmail.com',
        'lotalvaldenebro18@gmail.com',
        'jugador',
        '600000136'
    ), -- 18
    (
        227,
        'ADRIAN',
        'PUYUELO PRADERAS',
        'apuyuelopraderas19@gmail.com',
        'apuyuelopraderas19@gmail.com',
        'jugador',
        '600000137'
    ), -- 19
    (
        228,
        'MIGUEL ANGEL',
        'LAFUENTE BARLES',
        'mlafuentebarles20@gmail.com',
        'mlafuentebarles20@gmail.com',
        'jugador',
        '600000138'
    ), -- 20
    (
        229,
        'SERGIO',
        'CALVO RIVARES',
        'scalvorivares21@gmail.com',
        'scalvorivares21@gmail.com',
        'jugador',
        '600000139'
    ), -- 21
    (
        230,
        'MARCOS',
        'BASTAROS SANCLEMENTE',
        'mbastarosSanclemente22@gmail.com',
        'mbastarosSanclemente22@gmail.com',
        'jugador',
        '600000140'
    ), -- 22
    (
        231,
        'DAVID',
        'DIAZ OTI',
        'ddiazoti23@gmail.com',
        'ddiazoti23@gmail.com',
        'jugador',
        '600000141'
    );
-- 23

INSERT INTO
    Jugadores (
        id_usuario,
        id_equipo,
        posicion,
        numero_camiseta,
        activo
    )
VALUES (217, 13, 'PT', 1, true), -- NOVO GARCÍA, ERIC
    (218, 13, 'DFC', 5, true), -- OLIVAN IGLESIA, MARCOS ALONSO
    (219, 13, 'MC', 8, true), -- RUFAS CAMPO, MARIO
    (220, 13, 'DC', 9, true), -- SANAGUSTIN ESCARIO, CARLOS
    (221, 13, 'EI', 10, true), -- LAFUENTE ANIES, ALBERTO
    (222, 13, 'MI', 12, true), -- CALVO LAIRLA, JAVIER
    (223, 13, 'PT', 13, true), -- LANUZA LEON, AITOR
    (224, 13, 'MD', 14, true), -- UBICO MIRANDA, JORGE
    (225, 13, 'LD', 16, true), -- HEREZA ESTEBAN, DIEGO
    (226, 13, 'DFC', 18, true), -- OTAL VALDENEBRO, LORIEN
    (227, 13, 'DFC', 19, true), -- PUYUELO PRADERAS, ADRIAN
    (228, 13, 'EI', 20, true), -- LAFUENTE BARLES, MIGUEL ANGEL
    (229, 13, 'EI', 21, true), -- CALVO RIVARES, SERGIO
    (230, 13, 'LD', 22, true), -- BASTAROS SANCLEMENTE, MARCOS
    (231, 13, 'DC', 23, true);
-- DIAZ OTI, DAVID