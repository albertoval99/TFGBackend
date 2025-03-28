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
                numero_camiseta
            } = req.body;

            // Obtenemos el id_equipo del entrenador que está autenticado
            const id_equipo = req.body.user.id_equipo;

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
                activo: true
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



export default router;