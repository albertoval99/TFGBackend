import express, { Router, Request, Response } from "express";
import { esAutorizado, esEntrenador, esJugador } from "../../../context/security/auth";
import EntrenamientoUseCases from "../../application/entrenamiento.usecases";
import EntrenamientoRepositoryPostgres from "../db/entrenamiento.repository.postgres";
import Entrenamiento from "../../domain/Entrenamiento";

const router = express.Router();
const entrenamientoUseCases = new EntrenamientoUseCases(new EntrenamientoRepositoryPostgres());

// POST http://localhost:3000/api/entrenamientos/crear
router.post(
    "/crear",
    esAutorizado,
    esEntrenador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { fecha_hora_entrenamiento, duracion, id_equipo } = req.body;

            if (!id_equipo) {
                throw new Error("No se encontró el equipo del entrenador");
            }

            const nuevoEntrenamiento: Entrenamiento = {
                fecha_hora_entrenamiento: new Date(fecha_hora_entrenamiento),
                id_equipo,
                duracion
            };

            const entrenamiento = await entrenamientoUseCases.crearEntrenamiento(nuevoEntrenamiento);

            res.status(201).json({
                message: "Entrenamiento creado exitosamente",
                entrenamiento
            });
        } catch (error: any) {
            console.error("❌ Error al crear entrenamiento:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// GET http://localhost:3000/api/entrenamientos/equipo/:id_equipo
router.get(
    "/equipo/:id_equipo",
    esAutorizado,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id_equipo = req.params.id_equipo;

            if (!id_equipo) {
                throw new Error("No se encontró el ID del equipo");
            }

            const entrenamientos = await entrenamientoUseCases.getEntrenamientosEquipo(parseInt(id_equipo));
            res.status(200).json(entrenamientos);
        } catch (error: any) {
            console.error("❌ Error al obtener entrenamientos:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// DELETE http://localhost:3000/api/entrenamientos/:id/:id_equipo
router.delete(
    "/:id/:id_equipo",
    esAutorizado,
    esEntrenador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id_entrenamiento = req.params.id;
            const id_equipo = req.params.id_equipo;

            if (!id_equipo) {
                throw new Error("No se encontró el ID del equipo");
            }

            await entrenamientoUseCases.eliminarEntrenamiento(parseInt(id_entrenamiento), parseInt(id_equipo));
            res.status(200).json({ message: "Entrenamiento eliminado exitosamente" });
        } catch (error: any) {
            console.error("❌ Error al eliminar entrenamiento:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// PUT http://localhost:3000/api/entrenamientos/:id/asistencia
router.put(
    "/:id/asistencia",
    esAutorizado,
    esJugador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id_entrenamiento = req.params.id;
            const { asistio, justificacion, id_jugador } = req.body;

            if (!id_jugador) {
                throw new Error("No se encontró el ID del jugador");
            }

            const asistencia = await entrenamientoUseCases.actualizarAsistencia(
                parseInt(id_entrenamiento),
                id_jugador,
                asistio,
                justificacion
            );

            res.status(200).json({
                message: "Asistencia actualizada exitosamente",
                asistencia
            });
        } catch (error: any) {
            console.error("❌ Error al actualizar asistencia:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

//Ver asistencias de un entrenamiento
// GET http://localhost:3000/api/entrenamientos/:id/asistencias
router.get(
    "/:id/asistencias",
    esAutorizado,
    esEntrenador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id_entrenamiento = req.params.id;
            const asistencias = await entrenamientoUseCases.getAsistenciasEntrenamiento(parseInt(id_entrenamiento));
            res.status(200).json(asistencias);
        } catch (error: any) {
            console.error("❌ Error al obtener asistencias:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

//Ver asistencias de un jugador
// GET http://localhost:3000/api/entrenamientos/asistencias/:id
router.get(
    "/asistencias/:id_jugador",
    esAutorizado,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id_jugador = req.params.id_jugador;
            const asistencias = await entrenamientoUseCases.getAsistenciasJugador(parseInt(id_jugador));

            res.status(200).json({
                asistencias
            });
        } catch (error: any) {
            console.error("❌ Error al obtener asistencias:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;