import express, { Router, Request, Response } from "express";

import { esAutorizado, esAdministrador, esEntrenador, createToken, esArbitro, esJugador } from "../../../context/security/auth";
import PartidoUseCases from "../../application/partido.usecases";
import PartidoRepositoryPostgres from "../db/partido.repository.postgres";


const router = express.Router();
const partidoUseCases = new PartidoUseCases(new PartidoRepositoryPostgres);


// GET http://localhost:3000/api/partidos/:id_partido
router.get("/:id_partido", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_partido } = req.params;
        const idPartidoNum = parseInt(id_partido);

        if (isNaN(idPartidoNum)) {
            res.status(400).json({ message: "El ID del partido no es válido." });
            return;
        }

        const partido = await partidoUseCases.getPartidoById(idPartidoNum);

        if (!partido) {
            res.status(404).json({ message: "Partido no encontrado" });
            return;
        }

        res.status(200).json(partido);
    } catch (error) {
        console.error("❌ Error al obtener el partido por id:", error);
        res.status(500).json({
            message: error.message || "Error al obtener el partido",
        });
    }
});


// GET http://localhost:3000/api/partidos/ligas/:id_liga/jornada/:jornada
router.get("/ligas/:id_liga/jornada/:jornada", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_liga, jornada } = req.params;
        const idLigaNum = parseInt(id_liga);
        const jornadaNum = parseInt(jornada);

        if (isNaN(idLigaNum) || isNaN(jornadaNum)) {
            res.status(400).json({ message: "El ID de la liga o el número de jornada no es válido." });
            return;
        }

        const partidos = await partidoUseCases.getPartidosByJornada(idLigaNum, jornadaNum);

        res.status(200).json(partidos);
    } catch (error: any) {
        console.error("❌ Error al obtener los partidos de la jornada:", error);
        res.status(404).json({
            message: error.message || "No se encontraron partidos para esta jornada",
        });
    }
});

export default router;