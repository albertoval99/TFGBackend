import ClasificacionRepository from "../../domain/clasificacion.repository";
import { executeQuery } from '../../../context/db/postgres.db';
import PartidosJugados from "../../domain/PartidosJugados";
import VictoriasPorEquipo from "../../domain/VictoriasPorEquipo";
import EmpatesPorEquipo from "../../domain/EmpatesPorEquipo";
import GolesFavorPorEquipo from "../../domain/GolesFavorPorEquipo";
import GolesContraPorEquipo from "../../domain/GolesContraPorEquipo";

export default class ClasificacionRepositoryPostgres implements ClasificacionRepository {
    async getPartidosJugadosPorEquipo(id_liga: number): Promise<PartidosJugados[]> {
        const query = `
        SELECT e.id_equipo, COUNT(p.id_partido) AS jugados
        FROM Equipos e
            JOIN Partidos p
            ON e.id_equipo = p.equipo_local_id
            OR e.id_equipo = p.equipo_visitante_id
        WHERE
            p.id_liga = $1
            AND p.goles_local IS NOT NULL
            AND p.goles_visitante IS NOT NULL
        GROUP BY
            e.id_equipo;
        `;
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        return rows;
    }

    async getVictoriasPorEquipo(id_liga: number): Promise<VictoriasPorEquipo[]> {
        const query = `
        SELECT e.id_equipo, COUNT(p.id_partido) AS victorias
        FROM Equipos e
        JOIN Partidos p 
            ON (
                (e.id_equipo = p.equipo_local_id AND p.goles_local > p.goles_visitante)
                OR (e.id_equipo = p.equipo_visitante_id AND p.goles_visitante > p.goles_local)
            )
        WHERE 
            p.id_liga = $1
        GROUP BY
            e.id_equipo;
        `;
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        return rows.map(row => ({
            id_equipo: Number(row.id_equipo),
            victorias: Number(row.victorias)     
        }));
    }

    async getEmpatesPorEquipo(id_liga: number): Promise<EmpatesPorEquipo[]> {
        const query = `
        SELECT e.id_equipo, COUNT(p.id_partido) AS empates
        FROM Equipos e
        JOIN Partidos p 
            ON (
                (e.id_equipo = p.equipo_local_id AND p.goles_local = p.goles_visitante)
                OR (e.id_equipo = p.equipo_visitante_id AND p.goles_local = p.goles_visitante)
            )
        WHERE
            p.id_liga = $1
            AND p.goles_local IS NOT NULL
            AND p.goles_visitante IS NOT NULL
        GROUP BY
            e.id_equipo;
        `;
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        return rows.map(row => ({
            id_equipo: Number(row.id_equipo),
            empates: Number(row.empates)     
        }));
    }

    /**
     * Obtiene goles a favor combinando locales y visitantes en un solo query.
     */
    async getGolesFavorPorEquipo(id_liga: number): Promise<GolesFavorPorEquipo[]> {
        const query = `
            SELECT id_equipo, SUM(goles) AS goles_favor
            FROM (
                SELECT equipo_local_id   AS id_equipo, goles_local   AS goles
                FROM Partidos
                WHERE id_liga = $1 AND goles_local IS NOT NULL AND goles_visitante IS NOT NULL
                UNION ALL
                SELECT equipo_visitante_id AS id_equipo, goles_visitante AS goles
                FROM Partidos
                WHERE id_liga = $1 AND goles_local IS NOT NULL AND goles_visitante IS NOT NULL
            ) AS sub
            GROUP BY id_equipo;
        `;
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        return rows.map(row => ({
            id_equipo: row.id_equipo,
            goles_favor: Number(row.goles_favor)
        }));
    }

    /**
     * Obtiene goles en contra combinando locales y visitantes en un solo query.
     */
    async getGolesContraPorEquipo(id_liga: number): Promise<GolesContraPorEquipo[]> {
        const query = `
            SELECT id_equipo, SUM(goles) AS goles_contra
            FROM (
                SELECT equipo_local_id   AS id_equipo, goles_visitante AS goles
                FROM Partidos
                WHERE id_liga = $1 AND goles_local IS NOT NULL AND goles_visitante IS NOT NULL
                UNION ALL
                SELECT equipo_visitante_id AS id_equipo, goles_local AS goles
                FROM Partidos
                WHERE id_liga = $1 AND goles_local IS NOT NULL AND goles_visitante IS NOT NULL
            ) AS sub
            GROUP BY id_equipo;
        `;
        const values = [id_liga];
        const rows = await executeQuery(query, values);
        return rows.map(row => ({
            id_equipo: row.id_equipo,
            goles_contra: Number(row.goles_contra)
        }));
    }

}