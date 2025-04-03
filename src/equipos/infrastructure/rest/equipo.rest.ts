import express, { Router, Request, Response } from "express";
import EquipoUseCases from "../../application/equipo.usecases";
import EquipoRepositoryPostgres from "../db/equipo.repository.postgres";


const router = express.Router();
const equipoUseCases = new EquipoUseCases(new EquipoRepositoryPostgres);


// GET  http://localhost:3000/api/equipos/getEquipos

router.get(
    "/getEquipos",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const equipos = await equipoUseCases.getEquipos();

            res.status(201).json(equipos);
        } catch (error) {
            console.error("❌ Error al obtener equipos:", error);
            res.status(500).json({ message: "Error al obtener equipos", error: error.message });
        }
    }
);


export default router
