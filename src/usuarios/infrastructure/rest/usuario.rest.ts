import express, { Router, Request, Response } from "express";

import { esAutorizado, esAdministrador, esEntrenador, createToken } from "../../../context/security/auth";
import UsuarioUseCases from "../../application/usuario.usecases";
import UsuarioRepositoryPostgres from "../db/usuario.repository.postgres";

const router = express.Router();
const usuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryPostgres);

// POST http://localhost:3000/api/usuarios/registroEntrenador
router.post(
    "/registroEntrenador",
    esAutorizado,
    esAdministrador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, apellidos, email, password, telefono, foto, id_equipo } = req.body;

            if (!nombre || !apellidos || !email || !password || !id_equipo) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const entrenadorRegistrado = await usuarioUseCases.registrarEntrenador({
                nombre,
                apellidos,
                email,
                password,
                telefono,
                foto,
                id_equipo,
            });

            res.status(201).json({
                message: "Entrenador creado exitosamente",
                entrenador: entrenadorRegistrado,
            });
        } catch (error) {
            console.error("❌ Error al crear el entrenador:", error);
            res.status(500).json({ message: "Error al crear el entrenador", error: error.message });
        }
    }
);

// POST http://localhost:3000/api/usuarios/registroArbitro
router.post(
    "/registroArbitro",
    esAutorizado,
    esAdministrador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre, apellidos, email, password, telefono, foto } = req.body;

            if (!nombre || !apellidos || !email || !password) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const arbitroRegistrado = await usuarioUseCases.registrarArbitro({
                nombre,
                apellidos,
                email,
                password,
                telefono,
                foto
            });

            res.status(201).json({
                message: "Árbitro creado exitosamente",
                arbitro: arbitroRegistrado,
            });
        } catch (error) {
            console.error("❌ Error al crear el árbitro:", error);
            res.status(500).json({ message: "Error al crear el árbitro", error: error.message });
        }
    });

// POST http://localhost:3000/api/usuarios/registroJugador
router.post(
    "/registroJugador",
    esAutorizado,
    esEntrenador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                nombre,
                apellidos,
                email,
                password,
                telefono,
                foto,
                posicion,
                numero_camiseta,
                id_equipo,  // Viene de esEntrenador
                activo
            } = req.body;

            if (!nombre || !apellidos || !email || !password || !posicion || !numero_camiseta) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const jugadorRegistrado = await usuarioUseCases.registrarJugador({
                nombre,
                apellidos,
                email,
                password,
                telefono,
                foto,
                id_equipo,
                posicion,
                numero_camiseta,
                activo
            });

            res.status(201).json({
                message: "Jugador creado exitosamente",
                jugador: jugadorRegistrado,
            });
        } catch (error) {
            console.error("❌ Error al crear el jugador:", error);
            res.status(500).json({ message: "Error al crear el jugador", error: error.message });
        }
    });

/** 
// POST http://localhost:3000/api/usuarios/loginAdministrador
router.post(
    "/loginAdministrador",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const admin = await usuarioUseCases.loginAdministrador({
                email,
                password
            });

            const token = createToken({
                email: admin.email,
                rol: "administrador"
            });

            res.status(200).json({
                admin: {
                    id_administrador: admin.id_administrador,
                    nombre: admin.nombre,
                    apellidos: admin.apellidos,
                    email: admin.email
                },
                token
            });

        } catch (error) {
            console.error("❌ Error en login de administrador:", error);
            res.status(500).json({
                message: "Error en login de administrador",
                error: error.message
            });
        }
    });

// POST http://localhost:3000/api/usuarios/loginEntrenador
router.post(
    "/loginEntrenador",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const entrenador = await usuarioUseCases.loginEntrenador({
                email,
                password
            });

            const token = createToken({
                email: entrenador.email,
                rol: "entrenador"
            });

            res.status(200).json({
                entrenador: {
                    id_entrenador: entrenador.id_entrenador,
                    nombre: entrenador.nombre,
                    apellidos: entrenador.apellidos,
                    email: entrenador.email,
                    telefono: entrenador.telefono,
                    foto: entrenador.foto,
                    id_equipo: entrenador.id_equipo
                },
                token
            });

        } catch (error) {
            console.error("❌ Error en login de entrenador:", error);
            res.status(500).json({
                message: "Error en login de entrenador",
                error: error.message
            });
        }
    });

// POST http://localhost:3000/api/usuarios/loginArbitro
router.post(
    "/loginArbitro",
    async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }

        const arbitro = await usuarioUseCases.loginArbitro({
            email,
            password
        });

        const token = createToken({
            email: arbitro.email,
            rol: "arbitro"
        });

        res.status(200).json({
            arbitro: {
                id_arbitro: arbitro.id_arbitro,
                nombre: arbitro.nombre,
                apellidos: arbitro.apellidos,
                email: arbitro.email,
                telefono: arbitro.telefono,
                foto: arbitro.foto
            },
            token
        });

    } catch (error) {
        console.error("❌ Error en login de árbitro:", error);
        res.status(500).json({
            message: "Error en login de árbitro",
            error: error.message
        });
    }
});


// POST http://localhost:3000/api/usuarios/loginJugador
router.post(
    "/loginJugador",
    async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }

        const jugador = await usuarioUseCases.loginJugador({
            email,
            password
        });

        const token = createToken({
            email: jugador.email,
            rol: "jugador"
        });

        res.status(200).json({
            jugador: {
                id_jugador: jugador.id_jugador,
                nombre: jugador.nombre,
                apellidos: jugador.apellidos,
                email: jugador.email,
                telefono: jugador.telefono,
                foto: jugador.foto,
                id_equipo: jugador.id_equipo,
                posicion: jugador.posicion,
                numero_camiseta: jugador.numero_camiseta,
                activo: jugador.activo
            },
            token
        });

    } catch (error) {
        console.error("❌ Error en login de jugador:", error);
        res.status(500).json({
            message: "Error en login de jugador",
            error: error.message
        });
    }
});
*/
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, rol } = req.body;

        if (!email || !password || !rol) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }

        let usuario;
        switch (rol) {
            case 'administrador':
                usuario = await usuarioUseCases.loginAdministrador({ email, password });
                break;
            case 'entrenador':
                usuario = await usuarioUseCases.loginEntrenador({ email, password });
                break;
            case 'arbitro':
                usuario = await usuarioUseCases.loginArbitro({ email, password });
                break;
            case 'jugador':
                usuario = await usuarioUseCases.loginJugador({ email, password });
                break;
            default:
                res.status(400).json({ message: "Tipo de usuario no válido" });
                return;
        }


        const token = createToken({
            email: usuario.email,
            rol: usuario.rol,
            id_usuario: usuario.id_usuario 
        });

        res.status(200).json({
            usuario: {
                ...usuario,
                rol: usuario.rol
            },
            token
        });

    } catch (error) {
        console.error(`❌ Error en login: ${error}`);
        res.status(500).json({
            message: error.message || "Error en el inicio de sesión",
        });
    }
});


router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarios = await usuarioUseCases.getAllUsuarios();
        res.status(200).json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({
            message: error.message || "Error al obtener usuarios",
        });
    }
});
/** 
// GET http://localhost:3000/api/usuarios/email
router.get("/:email", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const usuario = await usuarioUseCases.getUserByEmail(email);

        if (!usuario) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener usuario por email:", error);
        res.status(500).json({
            message: error.message || "Error al obtener usuario",
        });
    }
});*/

// GET http://localhost:3000/api/usuarios/entrenador/id
router.get("/entrenador/:id_usuario", async (req: Request, res: Response): Promise<void> => {
    try {
        // Extraemos id_usuario de req.params
        const { id_usuario } = req.params;

        // Convertimos id_usuario de string a number
        const idUsuarioNum = parseInt(id_usuario); // O usar parseInt(id_usuario) si prefieres

        // Verificamos que la conversión fue exitosa
        if (isNaN(idUsuarioNum)) {
            res.status(400).json({ message: "El ID de usuario no es válido." });
            return;
        }

        // Ahora pasamos el número a la función que lo requiere como número
        const usuario = await usuarioUseCases.getEntrenadorById(idUsuarioNum);

        if (!usuario) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener usuario por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener usuario",
        });
    }
});

export default router;