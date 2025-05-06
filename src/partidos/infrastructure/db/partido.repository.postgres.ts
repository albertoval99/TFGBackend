import { executeQuery } from "../../../context/db/postgres.db";
import Partido from "../../domain/Partido";
import PartidoRepository from "../../domain/partido.repository";

export default class PartidoRepositoryPostgres implements PartidoRepository {

    async getPartidoById(id_partido: number): Promise<Partido | null> {
        const query = `
                SELECT 
                    p.*,
                    el.nombre_equipo AS equipo_local,
                    ev.nombre_equipo AS equipo_visitante,
                    e.nombre AS estadio,
                    e.ubicacion AS estadio_ubicacion,
                    u.nombre AS arbitro_nombre,
                    u.apellidos AS arbitro_apellidos
                FROM Partidos p
                JOIN Equipos el ON p.equipo_local_id = el.id_equipo
                JOIN Equipos ev ON p.equipo_visitante_id = ev.id_equipo
                JOIN Estadios e ON p.id_estadio = e.id_estadio
                LEFT JOIN Arbitros a ON p.id_arbitro = a.id_arbitro
                LEFT JOIN Usuarios u ON a.id_usuario = u.id_usuario
                WHERE p.id_partido = $1
            `;
        const values = [id_partido];
        const rows = await executeQuery(query, values);
        if (rows.length === 0) return null;
        return rows[0];
    }

    async getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]> {
        const query = `
            SELECT 
                p.*,
                el.nombre_equipo AS equipo_local,
                ev.nombre_equipo AS equipo_visitante,
                e.nombre AS estadio,
                e.ubicacion AS estadio_ubicacion,
                u.nombre AS arbitro_nombre,
                u.apellidos AS arbitro_apellidos
            FROM Partidos p
            JOIN Equipos el ON p.equipo_local_id = el.id_equipo
            JOIN Equipos ev ON p.equipo_visitante_id = ev.id_equipo
            JOIN Estadios e ON p.id_estadio = e.id_estadio
            LEFT JOIN Arbitros a ON p.id_arbitro = a.id_arbitro
            LEFT JOIN Usuarios u ON a.id_usuario = u.id_usuario
            WHERE p.id_liga = $1 AND p.jornada = $2
            ORDER BY p.hora_partido ASC
        `;
        const values = [id_liga, jornada];
        const rows = await executeQuery(query, values);
        return rows;
    }

    async updatePartido(id_partido: number, fecha_partido: string | null, hora_partido: string | null, id_estadio: number | null): Promise<Partido> {
        let updateFields: string[] = [];
        let values: any[] = [id_partido];
        let paramCount = 1;

        if (fecha_partido !== null) {
            updateFields.push(`fecha_partido = $${++paramCount}`);
            values.push(fecha_partido);
        }
        if (hora_partido !== null) {
            updateFields.push(`hora_partido = $${++paramCount}`);
            values.push(hora_partido);
        }
        if (id_estadio !== null) {
            updateFields.push(`id_estadio = $${++paramCount}`);
            values.push(id_estadio);
        }

        const query = `
            UPDATE Partidos 
            SET ${updateFields.join(', ')}
            WHERE id_partido = $1
            RETURNING *
        `;

        const result = await executeQuery(query, values);
        return result[0];
    }

    async getPartidosByLiga(id_liga: number): Promise<Partido[]> {
        
    }

}