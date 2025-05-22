import express, { Router, Request, Response } from "express";
import ClasificacionUseCase from "../../application/clasificacion.usecases";
import ClasificacionRepositoryPostgres from "../db/clasificacion.repository.postgres";
import EquipoRepositoryPostgres from "../../../equipos/infrastructure/db/equipo.repository.postgres";

const router = express.Router();
const clasificacionUseCases = new ClasificacionUseCase(new ClasificacionRepositoryPostgres, new EquipoRepositoryPostgres);

// GET http://localhost:3000/api/clasificacion/:id_liga
router.get('/:id_liga', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_liga } = req.params;
        const idLigaNum = parseInt(id_liga, 10);

        if (isNaN(idLigaNum)) {
            res.status(400).json({ message: 'El ID de la liga no es válido.' });
            return;
        }

        const clasificacion = await clasificacionUseCases.obtenerClasificacion(idLigaNum);

        if (!clasificacion || clasificacion.length === 0) {
            res.status(404).json({ message: 'Clasificación no encontrada o vacía.' });
            return;
        }

        res.status(200).json(clasificacion);
    } catch (error) {
        console.error('❌ Error al obtener la clasificación:', error);
        res.status(500).json({
            message: error.message || 'Error al obtener la clasificación',
        });
    }
});

export default router;