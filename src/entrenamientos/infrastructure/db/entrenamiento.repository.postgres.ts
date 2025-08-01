import { executeQuery } from "../../../context/db/postgres.db";
import Asistencias from "../../domain/Asistencias";
import Entrenamiento from "../../domain/Entrenamiento";
import EntrenamientoRepository from "../../domain/entrenamiento.repository";

export default class EntrenamientoRepositoryPostgres implements EntrenamientoRepository {
    async crearEntrenamiento(entrenamiento: Entrenamiento): Promise<Entrenamiento> {
        const query = `
            INSERT INTO Entrenamientos (fecha_hora_entrenamiento, id_equipo, duracion)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [
            entrenamiento.fecha_hora_entrenamiento,
            entrenamiento.id_equipo,
            entrenamiento.duracion
        ];
        const result = await executeQuery(query, values);
        return result[0];
    }

    async eliminarEntrenamiento(id_entrenamiento: number, id_equipo: number): Promise<boolean> {
        const query = `
            DELETE FROM Entrenamientos
            WHERE id_entrenamiento = $1
            AND id_equipo = $2
            AND fecha_hora_entrenamiento >= CURRENT_DATE
            RETURNING *
        `;
        const values = [id_entrenamiento, id_equipo];
        const result = await executeQuery(query, values);
        return result.length > 0;
    }

    async getEntrenamientosEquipo(id_equipo: number): Promise<Entrenamiento[]> {
        const query = `
            SELECT *
            FROM Entrenamientos
            WHERE id_equipo = $1
            AND fecha_hora_entrenamiento >= CURRENT_DATE
            ORDER BY fecha_hora_entrenamiento ASC
        `;
        const values = [id_equipo];
        const result = await executeQuery(query, values);
        return result;
    }

    async crearAsistenciasJugadores(id_entrenamiento: number, id_equipo: number): Promise<void> {
        const query = `
            INSERT INTO Asistencias (id_entrenamiento, id_jugador)
            SELECT $1, id_jugador
            FROM Jugadores
            WHERE id_equipo = $2
        `;
        const values = [id_entrenamiento, id_equipo];
        await executeQuery(query, values);
    }

    async actualizarAsistencia(id_entrenamiento: number, id_usuario: number, asistio: boolean, justificacion?: string): Promise<Asistencias> {
        const jugadorQuery = `
        SELECT id_jugador 
        FROM Jugadores
        WHERE id_usuario = $1
    `;
        const jugadorResult = await executeQuery(jugadorQuery, [id_usuario]);

        if (jugadorResult.length === 0) {
            throw new Error("No se encontró un jugador asociado al usuario");
        }

        const id_jugador = jugadorResult[0].id_jugador;

        // Actualizar la asistencia
        const updateQuery = `
        UPDATE Asistencias
        SET asistio = $1, justificacion = $2
        WHERE id_entrenamiento = $3 AND id_jugador = $4
        RETURNING *
    `;
        const updateValues = [asistio, justificacion, id_entrenamiento, id_jugador];
        const updateResult = await executeQuery(updateQuery, updateValues);

        if (updateResult.length > 0) {
            return updateResult[0];
        }

        // Si aun no habia votado, insertar la asistencia
        const insertQuery = `
        INSERT INTO Asistencias (id_entrenamiento, id_jugador, asistio, justificacion)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
        const insertValues = [id_entrenamiento, id_jugador, asistio, justificacion];
        const insertResult = await executeQuery(insertQuery, insertValues);

        if (insertResult.length === 0) {
            throw new Error("No se pudo crear la asistencia");
        }

        return insertResult[0];
    }

    async getAsistenciasEntrenamiento(id_entrenamiento: number): Promise<Asistencias[]> {
        const query = `
        SELECT a.*, u.nombre, u.apellidos
        FROM Asistencias a
        JOIN Jugadores j ON a.id_jugador = j.id_jugador
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        WHERE a.id_entrenamiento = $1
    `;
        const values = [id_entrenamiento];
        const result = await executeQuery(query, values);
        return result;
    }

    async getAsistenciasJugador(id_usuario: number): Promise<Asistencias[]> {
        const query = `
        SELECT a.*
        FROM Asistencias a
        JOIN Jugadores j ON j.id_jugador = a.id_jugador
        JOIN Entrenamientos e ON e.id_entrenamiento = a.id_entrenamiento
        WHERE j.id_usuario = $1
        AND e.fecha_hora_entrenamiento >= CURRENT_DATE
    `;
        const values = [id_usuario];
        const result = await executeQuery(query, values);
        return result;
    }
}