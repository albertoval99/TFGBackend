import express, { Router, Request, Response } from "express";

import { esAutorizado, esAdministrador, esEntrenador, createToken, esArbitro, esJugador } from "../../../context/security/auth";
import PartidoUseCases from "../../application/partido.usecases";
import PartidoRepositoryPostgres from "../db/partido.repository.postgres";
import Partido from "../../domain/Partido";


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

// PUT http://localhost:3000/api/partidos/:id_partido
router.put("/:id_partido", esAutorizado, esArbitro, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_partido } = req.params;
        const { fecha_partido, hora_partido, id_estadio } = req.body;
        const idPartidoNum = parseInt(id_partido);

        if (isNaN(idPartidoNum)) {
            res.status(400).json({ message: "El ID del partido no es válido" });
            return;
        }

        if (fecha_partido === undefined &&
            hora_partido === undefined &&
            id_estadio === undefined) {
            res.status(400).json({
                message: "Debe proporcionar al menos un campo para actualizar"
            });
            return;
        }

        const idEstadioNum = id_estadio ? parseInt(id_estadio) : null;
        if (id_estadio && isNaN(idEstadioNum)) {
            res.status(400).json({ message: "El ID del estadio no es válido" });
            return;
        }

        const partidoActualizado = await partidoUseCases.updatePartido(
            idPartidoNum,
            fecha_partido || null,
            hora_partido || null,
            idEstadioNum
        );

        res.status(200).json({
            message: "Partido actualizado correctamente",
            data: partidoActualizado
        });

    } catch (error: any) {
        console.error("❌ Error al actualizar el partido:", error);
        res.status(error.status || 400).json({
            message: error.message || "Error al actualizar el partido"
        });
    }
});

// GET http://localhost:3000/api/partidos/ligas/:id_liga
router.get("/ligas/:id_liga", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_liga } = req.params;
        const idLigaNum = parseInt(id_liga);

        if (isNaN(idLigaNum)) {
            res.status(400).json({ message: "El ID de la liga no es válido" });
            return;
        }

        const calendario = await partidoUseCases.getPartidosByLiga(idLigaNum);

        res.status(200).json({
            message: "Calendario obtenido correctamente",
            data: calendario
        });

    } catch (error: any) {
        console.error("❌ Error al obtener el calendario:", error);
        res.status(404).json({
            message: error.message || "Error al obtener el calendario de la liga"
        });
    }
});

// GET http://localhost:3000/api/partidos/equipos/:id_equipo
router.get("/equipos/:id_equipo", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_equipo } = req.params;
        const idEquipoNum = parseInt(id_equipo);

        if (isNaN(idEquipoNum)) {
            res.status(400).json({ message: "El ID del equipo no es válido" });
            return;
        }

        const partidos = await partidoUseCases.getPartidosByEquipo(idEquipoNum);

        res.status(200).json({
            message: "Partidos del equipo obtenidos correctamente",
            data: partidos
        });

    } catch (error: any) {
        console.error("❌ Error al obtener los partidos del equipo:", error);
        res.status(404).json({
            message: error.message || "Error al obtener los partidos del equipo"
        });
    }
});

// GET http://localhost:3000/api/partidos/alineaciones/partido/:id_partido
router.get("/alineaciones/partido/:id_partido", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_partido } = req.params;
        const idPartidoNum = parseInt(id_partido);

        if (isNaN(idPartidoNum)) {
            res.status(400).json({ message: "El ID del partido no es válido" });
            return;
        }

        const alineaciones = await partidoUseCases.getAlineacionesByPartido(idPartidoNum);

        res.status(200).json({
            message: "Alineaciones del partido obtenidas correctamente",
            data: alineaciones
        });

    } catch (error: any) {
        console.error("❌ Error al obtener las alineaciones del partido:", error);
        res.status(404).json({
            message: error.message || "Error al obtener las alineaciones del partido"
        });
    }
});

// POST http://localhost:3000/api/partidos/alineaciones/registro
router.post("/alineaciones/registro", esAutorizado, esEntrenador, async (req: Request, res: Response): Promise<void> => {
    try {
        const alineacion = req.body;

        if (!alineacion.id_partido || !alineacion.id_jugador || alineacion.es_titular === undefined || !alineacion.id_equipo) {
            res.status(400).json({ message: "Faltan campos obligatorios: id_partido, id_jugador, es_titular, id_equipo" });
            return;
        }

        const alineacionRegistrada = await partidoUseCases.registrarAlineacion(alineacion);

        res.status(201).json({
            message: "Alineación registrada correctamente",
            data: alineacionRegistrada
        });

    } catch (error: any) {
        console.error("❌ Error al registrar la alineación:", error);
        res.status(500).json({
            message: error.message || "Error al registrar la alineación"
        });
    }
});


// GET http://localhost:3000/api/partidos/arbitro/:id_arbitro
router.get("/arbitro/:id_arbitro", esAutorizado, esArbitro, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_arbitro } = req.params;
        const idArbitroNum = parseInt(id_arbitro);

        if (isNaN(idArbitroNum)) {
            res.status(400).json({ message: "El ID del árbitro no es válido" });
            return;
        }

        const partidos = await partidoUseCases.getPartidosByArbitro(idArbitroNum);

        res.status(200).json({
            message: "Partidos del árbitro obtenidos correctamente",
            data: partidos
        });

    } catch (error: any) {
        console.error("❌ Error al obtener los partidos del árbitro:", error);
        res.status(404).json({
            message: error.message || "Error al obtener los partidos del árbitro"
        });
    }
});

// PUT http://localhost:3000/api/partidos/:id_partido/registrarEstadisticas
router.put("/:id_partido/registrarEstadisticas", esAutorizado, esArbitro, async (req: Request, res: Response): Promise<void> => {
    try {
        const id_partido = parseInt(req.params.id_partido);
        const { goles_local, goles_visitante, estadisticas_individuales } = req.body;

        if (isNaN(id_partido)) {
            res.status(400).json({ message: "El ID del partido no es válido" });
            return;
        }

        if (goles_local == null || goles_visitante == null || !Array.isArray(estadisticas_individuales) || estadisticas_individuales.length === 0) {
            res.status(400).json({ message: "Datos incompletos para registrar estadísticas" });
            return;
        }

        const partido = { id_partido, goles_local, goles_visitante };

        await partidoUseCases.registrarEstadisticas(partido, estadisticas_individuales);

        res.status(200).json({ message: "Estadísticas registradas correctamente" });
    } catch (error: any) {
        console.error("❌ Error al registrar estadísticas:", error);
        res.status(500).json({ message: error.message || "Error al registrar estadísticas" });
    }
});


// GET http://localhost:3000/api/partidos/:id_partido/estadisticas
router.get("/:id_partido/estadisticas", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_partido } = req.params;
        const idPartidoNum = parseInt(id_partido);

        if (isNaN(idPartidoNum)) {
            console.log("❌ ID de partido no válido");
            res.status(400).json({ message: "El ID del partido no es válido." });
        }

        const estadisticas = await partidoUseCases.getEstadisticasByPartido(idPartidoNum);

        res.status(200).json({
            message: "Estadísticas del partido obtenidas correctamente",
            data: estadisticas
        });
    } catch (error: any) {
        console.error("❌ Error al obtener las estadísticas del partido:", error);

        const statusCode = error.statusCode || 500;
        const message = error.message || "Error al obtener las estadísticas del partido";

        res.status(statusCode).json({ message });
    }
});


export default router;