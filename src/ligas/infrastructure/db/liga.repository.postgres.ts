import Liga from "../../domain/Liga";
import LigaRepository from "../../domain/liga.repository";
import { executeQuery } from '../../../context/db/postgres.db';

export default class LigaRepositoryPostgres implements LigaRepository {
    async registrarLiga(liga: Liga): Promise<Liga> {
        const query = `
            INSERT INTO ligas (nombre_liga, categoria, grupo, temporada, descripcion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            liga.nombre_liga,
            liga.categoria,
            liga.grupo,
            liga.temporada,
            liga.descripcion
        ];

        const rows = await executeQuery(query, values);

        return rows[0];
    }

    async getLigaById(id_liga: number): Promise<Liga | null> {
        const query = "SELECT * FROM ligas WHERE id_liga = $1";
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        if (rows.length === 0) return null;
        return rows[0];
    }

    async getLigas(): Promise<Liga[]> {
        const query = "SELECT * FROM ligas";
        const result = await executeQuery(query);

        if (result.length === 0) {
            return [];
        }
        return result;
    }
}