import express, { Router, Request, Response } from "express";

import { esAutorizado, esAdministrador } from "../../../context/security/auth";
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

            // Validate required fields
            if (!nombre || !apellidos || !email || !password || !id_equipo) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return; // Ensure no further execution
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

export default router;