
import express, { Router, Request, Response } from "express";
import EstadisticasUseCases from "../../application/estadisticas.usecases";
import EstadisticasRepositoryPostgres from "../db/estadisticas.repository.postgres";



const router = express.Router();
const estadisticasUseCases = new EstadisticasUseCases(new EstadisticasRepositoryPostgres);


// GET http://localhost:3000/api/estadisticas/jugador/:id_jugador
router.get("/jugador/:id_jugador", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_jugador } = req.params;
        const idJugadorNum = parseInt(id_jugador);

        if (isNaN(idJugadorNum)) {
            res.status(400).json({ message: "El ID del jugador no es válido." });
            return;
        }

        const estadisticas = await estadisticasUseCases.getEstadisticasJugador(idJugadorNum);

        res.status(200).json({
            message: "Estadísticas del jugador obtenidas correctamente",
            data: estadisticas
        });
    } catch (error: any) {
        console.error("❌ Error al obtener las estadísticas del jugador:", error);
        res.status(404).json({
            message: error.message || "Error al obtener las estadísticas del jugador"
        });
    }
});
export default router;