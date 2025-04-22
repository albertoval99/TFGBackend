import express, { Router, Request, Response } from "express";

import { esAutorizado, esAdministrador, esEntrenador, createToken } from "../../../context/security/auth";
import LigaUseCases from "../../application/liga.usecases";
import LigaRepositoryPostgres from "../db/liga.repository.postgres";


const router = express.Router();
const ligaUseCases = new LigaUseCases(new LigaRepositoryPostgres);

// POST http://localhost:3000/api/ligas/registroLiga
router.post(
    "/registroLiga",
    esAutorizado,
    esAdministrador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre_liga, categoria, grupo, temporada, descripcion } = req.body;

            if (!nombre_liga || !categoria || !grupo || !temporada) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const ligaRegistrada = await ligaUseCases.registroLiga({
                nombre_liga,
                categoria,
                grupo,
                temporada,
                descripcion,
            });

            res.status(201).json({
                message: "Liga creada exitosamente",
                liga: ligaRegistrada,
            });
        } catch (error: any) {
            console.error("❌ Error al crear la liga:", error);
            res.status(500).json({ message: error.message || "Error al crear la liga" });
        }
    }
);

export default router;