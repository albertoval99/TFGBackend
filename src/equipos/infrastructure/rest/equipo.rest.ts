import express, { Request, Response } from "express";
import EquipoUseCases from "../../application/equipo.usecases";
import EquipoRepositoryPostgres from "../db/equipo.repository.postgres";
import LigaRepositoryPostgres from "../../../ligas/infrastructure/db/liga.repository.postgres";
import { esAutorizado, esAdministrador } from "../../../context/security/auth";
const router = express.Router();
const equipoUseCases = new EquipoUseCases(new EquipoRepositoryPostgres, new LigaRepositoryPostgres());

// GET  http://localhost:3000/api/equipos/getEquipos
router.get(
    "/getEquipos",
    async (req: Request, res: Response): Promise<void> => {
        try {
            const equipos = await equipoUseCases.getEquipos();
            res.status(201).json(equipos);
        } catch (error) {
            console.error("❌ Error al obtener equipos:", error);
            res.status(500).json({ message: "Error al obtener equipos" });
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
        res.status(500).json({ message: "Error al obtener equipo" });
    }
});

// POST http://localhost:3000/api/equipos/registroEquipo
router.post(
    "/registroEquipo",
    esAutorizado,
    esAdministrador,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre_equipo, id_liga, escudo } = req.body;

            if (!nombre_equipo || !id_liga) {
                res.status(400).json({ message: "Faltan campos obligatorios" });
                return;
            }

            const equipoRegistrado = await equipoUseCases.registroEquipo({
                nombre_equipo,
                id_liga,
                escudo
            });

            res.status(201).json({
                message: "Equipo creado con exito",
                equipo: equipoRegistrado
            });

        } catch (error) {
            console.error("❌ Error al crear el equipo:", error);
            res.status(500).json({ message: "Error al crear el equipo" });
        }
    }
);

// GET http://localhost:3000/api/equipos/estadios/getEstadios
router.get("/estadios/getEstadios", async (req: Request, res: Response) => {
    try {
        const estadios = await equipoUseCases.getAllEstadios();
        res.status(200).json(estadios);
    } catch (error) {
        console.error("❌ Error al obtener estadios:", error);
        res.status(500).json({ message: "Error al obtener estadios" });
    }
});

// GET  http://localhost:3000/api/equipos/:id_equipo/jugadores
router.get("/:id_equipo/jugadores", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_equipo } = req.params;
        const idEquipoNum = parseInt(id_equipo);

        if (isNaN(idEquipoNum)) {
            res.status(400).json({ message: "El ID del equipo no es válido." });
            return;
        }

        const jugadores = await equipoUseCases.getJugadoresByEquipo(idEquipoNum);

        res.status(200).json(jugadores);
    } catch (error) {
        console.error("❌ Error al obtener jugadores del equipo:", error);
        res.status(500).json({ message: "Error al obtener jugadores del equipo" });
    }
}
);

export default router
