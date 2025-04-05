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

// GET  http://localhost:3000/api/equipos/id
router.get("/:id_equipo", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_equipo } = req.params;
        const idEquipoNum = parseInt(id_equipo);

        if (isNaN(idEquipoNum)) {
            res.status(400).json({ message: "El ID del equipo no es válido." });
            return;
        }

        const equipo = await equipoUseCases.getEquipoById(idEquipoNum);

        if (!equipo) {
            res.status(404).json({ message: "Equipo no encontrado" });
            return;
        }

        res.status(200).json(equipo);
    } catch (error) {
        console.error("❌ Error al obtener equipo por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener equipo",
        });
    }
});



export default router
