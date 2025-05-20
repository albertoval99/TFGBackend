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
            res.status(500).json({ message: error.message || "Error al crear el entrenador" });
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

            res.status(500).json({ message: error.message || "Error al crear el árbitro" });
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
                id_equipo,
                numero_camiseta,
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
                posicion,
                id_equipo,
                numero_camiseta,
                activo
            });

            res.status(201).json({
                message: "Jugador creado exitosamente",
                jugador: jugadorRegistrado,
            });
        } catch (error) {
            console.error("❌ Error al crear el jugador:", error);
            res.status(500).json({ message: error.message || "Error al crear el jugador" });
        }
    });

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
});

// GET http://localhost:3000/api/usuarios/entrenador/id
router.get("/entrenador/:id_usuario", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario } = req.params;
        const idUsuarioNum = parseInt(id_usuario);

        if (isNaN(idUsuarioNum)) {
            res.status(400).json({ message: "El ID de entrenador no es válido." });
            return;
        }

        const usuario = await usuarioUseCases.getEntrenadorById(idUsuarioNum);

        if (!usuario) {
            res.status(404).json({ message: "Entrenador no encontrado" });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener entrenador por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener entrenador",
        });
    }
});


// GET http://localhost:3000/api/usuarios/jugador/id
router.get("/jugador/:id_usuario", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario } = req.params;
        const idUsuarioNum = parseInt(id_usuario);

        if (isNaN(idUsuarioNum)) {
            res.status(400).json({ message: "El ID de jugador no es válido." });
            return;
        }

        const usuario = await usuarioUseCases.getJugadorCompletoById(idUsuarioNum);

        if (!usuario) {
            res.status(404).json({ message: "Jugador no encontrado" });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener jugador por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener jugador",
        });
    }
});


// GET http://localhost:3000/api/usuarios/arbitro/id
router.get("/arbitro/:id_usuario", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario } = req.params;
        const idUsuarioNum = parseInt(id_usuario);

        if (isNaN(idUsuarioNum)) {
            res.status(400).json({ message: "El ID de arbitro no es válido." });
            return;
        }

        const usuario = await usuarioUseCases.getArbitroCompletoById(idUsuarioNum);

        if (!usuario) {
            res.status(404).json({ message: "Arbitro no encontrado" });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener arbitro por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener arbitro",
        });
    }
});


// GET http://localhost:3000/api/usuarios/equipo/:id_equipo
router.get("/equipo/:id_equipo", esAutorizado, esEntrenador, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_equipo } = req.params;
        const idEquipoNum = parseInt(id_equipo);

        if (isNaN(idEquipoNum)) {
            res.status(400).json({ message: "El ID del equipo no es válido." });
            return;
        }

        const jugadores = await usuarioUseCases.getJugadoresByEquipo(idEquipoNum);
        res.status(200).json(jugadores);
    } catch (error) {
        console.error("❌ Error al obtener jugadores por equipo:", error);
        res.status(500).json({
            message: error.message || "Error al obtener jugadores del equipo",
        });
    }
});

// DELETE http://localhost:3000/api/usuarios/:id_usuario
router.delete("/:id_usuario", esAutorizado, esEntrenador, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario } = req.params;
        const idUsuarioNum = parseInt(id_usuario);

        if (isNaN(idUsuarioNum)) {
            res.status(400).json({ message: "El ID de usuario no es válido" });
            return;
        }

        await usuarioUseCases.eliminarUsuario(idUsuarioNum);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);

        if (error.message === "Usuario no encontrado") {
            res.status(404).json({ message: error.message });
            return;
        }

        res.status(500).json({
            message: error.message || "Error al eliminar el usuario"
        });
    }
});


// PUT http://localhost:3000/api/usuarios/jugador/:id_jugador
router.put("/jugador/:id_jugador", esAutorizado, esEntrenador, async (req: Request, res: Response) => {
    try {
        const { id_jugador } = req.params;
        const { posicion, numero_camiseta, activo } = req.body;
        const idJugadorNum = parseInt(id_jugador);

        if (posicion === undefined &&
            numero_camiseta === undefined &&
            activo === undefined
        ) {
            res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
            return;
        }

        const numeroCamisetaNum = numero_camiseta !== undefined ? parseInt(numero_camiseta) : undefined;
        const activoBool = activo !== undefined ? Boolean(activo) : undefined;

        await usuarioUseCases.editarJugador(
            idJugadorNum,
            posicion,
            numeroCamisetaNum,
            activoBool
        );

        res.status(200).json({ message: "Jugador actualizado correctamente" });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(400).json({ message: error.message || "Error al actualizar el jugador" });
    }
});


// PATCH http://localhost:3000/api/usuarios/actualizar
router.patch("/actualizar", esAutorizado, async (req: Request, res: Response) => {
    try {
        const { id_usuario, email, telefono } = req.body;
        const userIdToken = req.body.user.id_usuario;

        if (!id_usuario) {
             res.status(400).json({ mensaje: "id_usuario es obligatorio" });
        }

        if (id_usuario !== userIdToken) {
             res.status(403).json({ mensaje: "No tiene permiso para actualizar este usuario" });
        }

        if ((email === undefined || email === "") && (telefono === undefined || telefono === "")) {
             res.status(400).json({ mensaje: "Debe enviar al menos email o teléfono para actualizar" });
        }

        const usuario = await usuarioUseCases.actualizarUsuario({
            id_usuario,
            email,
            telefono
        });

        res.status(200).json({ usuario });
    } catch (error) {
        console.error("Error en la actualización:", error);
        res.status(500).json({ mensaje: `Error actualizando usuario: ${error.message}` });
    }
});

export default router;