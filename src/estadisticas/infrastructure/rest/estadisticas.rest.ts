import express, { Request, Response } from "express";
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
        res.status(200).json({data: estadisticas});
    } catch (error) {
        console.error("❌ Error al obtener las estadísticas del jugador:", error);
        res.status(500).json({message: "Error al obtener las estadísticas del jugador"});
    }
});

// GET http://localhost:3000/api/estadisticas/maximo-goleador
router.get("/maximo-goleador", async (req: Request, res: Response): Promise<void> => {
    try {
        const maximoGoleador = await estadisticasUseCases.getMaximoGoleador();
        res.status(200).json({data: maximoGoleador});
    } catch (error) {
        console.error("❌ Error al obtener el máximo goleador:", error);
        res.status(500).json({message: "Error al obtener el máximo goleador"});
    }
});

// GET http://localhost:3000/api/estadisticas/maximos-goleadores
router.get("/maximos-goleadores", async (req: Request, res: Response): Promise<void> => {
    try {
        const maximosGoleadores = await estadisticasUseCases.getMaximosGoleadores();
        res.status(200).json({data: maximosGoleadores});
    } catch (error) {
        console.error("❌ Error al obtener los máximos goleadores:", error);
        res.status(500).json({message: "Error al obtener los máximos goleadores"});
    }
});

// GET http://localhost:3000/api/estadisticas/mejor-jugador
router.get("/mejor-jugador", async (req: Request, res: Response): Promise<void> => {
    try {
        const mejorJugador = await estadisticasUseCases.getMejorJugador();
        res.status(200).json({data: mejorJugador});
    } catch (error) {
        console.error("❌ Error al obtener el mejor jugador:", error);
        res.status(500).json({message: "Error al obtener el mejor jugador"});
    }
});

// GET http://localhost:3000/api/estadisticas/mejores-jugadores
router.get("/mejores-jugadores", async (req: Request, res: Response): Promise<void> => {
    try {
        const mejoresJugadores = await estadisticasUseCases.getMejoresJugadores();
        res.status(200).json({data: mejoresJugadores});
    } catch (error) {
        console.error("❌ Error al obtener los mejores jugadores:", error);
        res.status(500).json({message: "Error al obtener los mejores jugadores"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugador-mas-amarillas
router.get("/jugador-mas-amarillas", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadorConMasAmarillas = await estadisticasUseCases.getJugadorConMasAmarillas();
        res.status(200).json({data: jugadorConMasAmarillas});
    } catch (error) {
        console.error("❌ Error al obtener el jugador con más amarillas:", error);
        res.status(500).json({message: "Error al obtener el jugador con más amarillas"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugadores-mas-amarillas
router.get("/jugadores-mas-amarillas", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadoresConMasAmarillas = await estadisticasUseCases.getJugadoresConMasAmarillas();
        res.status(200).json({data: jugadoresConMasAmarillas});
    } catch (error) {
        console.error("❌ Error al obtener los jugadores con más amarillas:", error);
        res.status(500).json({message: "Error al obtener los jugadores con más amarillas"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugador-mas-rojas
router.get("/jugador-mas-rojas", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadorConMasRojas = await estadisticasUseCases.getJugadorConMasRojas();
        res.status(200).json({data: jugadorConMasRojas});
    } catch (error) {
        console.error("❌ Error al obtener el jugador con más rojas:", error);
        res.status(500).json({message: "Error al obtener el jugador con más rojas"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugadores-mas-rojas
router.get("/jugadores-mas-rojas", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadoresConMasRojas = await estadisticasUseCases.getJugadoresConMasRojas();
        res.status(200).json({data: jugadoresConMasRojas});
    } catch (error) {
        console.error("❌ Error al obtener los jugadores con más rojas:", error);
        res.status(500).json({message: "Error al obtener los jugadores con más rojas"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugador-mas-titularidades
router.get("/jugador-mas-titularidades", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadorConMasTitularidades = await estadisticasUseCases.getJugadorConMasTitularidades();
        res.status(200).json({data: jugadorConMasTitularidades});
    } catch (error) {
        console.error("❌ Error al obtener el jugador con más titularidades:", error);
        res.status(500).json({message: "Error al obtener el jugador con más titularidades"});
    }
});

// GET http://localhost:3000/api/estadisticas/jugadores-mas-titularidades
router.get("/jugadores-mas-titularidades", async (req: Request, res: Response): Promise<void> => {
    try {
        const jugadoresConMasTitularidades = await estadisticasUseCases.getJugadoresConMasTitularidades();
        res.status(200).json({data: jugadoresConMasTitularidades});
    } catch (error) {
        console.error("❌ Error al obtener los jugadores con más titularidades:", error);
        res.status(500).json({message: "Error al obtener los jugadores con más titularidades"});
    }
});

export default router;