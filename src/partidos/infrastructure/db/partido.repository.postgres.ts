import { executeQuery } from "../../../context/db/postgres.db";
import AlineacionPartido from "../../domain/AlineacionPartido";
import EstadisticasJugador from "../../domain/EstadisticasJugador";
import EstadisticasPartidoCompleto from "../../domain/EstadisticasPartidoCompleto";
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
              p.id_partido,
              p.jornada,
              p.goles_local,
              p.goles_visitante,
              el.nombre_equipo AS equipo_local,
              ev.nombre_equipo AS equipo_visitante,
              e.nombre AS estadio,
              e.ubicacion AS estadio_ubicacion,
              u.nombre AS arbitro_nombre,
              u.apellidos AS arbitro_apellidos,
              TO_CHAR(p.fecha_partido, 'DD/MM/YYYY') as fecha_partido,
              p.hora_partido
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
    const query = `
            SELECT 
              p.jornada,
              p.goles_local,
              p.goles_visitante,
              el.nombre_equipo AS equipo_local,
              ev.nombre_equipo AS equipo_visitante,
              e.nombre AS estadio,
              e.ubicacion AS estadio_ubicacion,
              u.nombre AS arbitro_nombre,
              u.apellidos AS arbitro_apellidos,
              TO_CHAR(p.fecha_partido, 'DD/MM/YYYY') as fecha_partido
            FROM Partidos p
            JOIN Equipos el ON p.equipo_local_id = el.id_equipo
            JOIN Equipos ev ON p.equipo_visitante_id = ev.id_equipo
            JOIN Estadios e ON p.id_estadio = e.id_estadio
            LEFT JOIN Arbitros a ON p.id_arbitro = a.id_arbitro
            LEFT JOIN Usuarios u ON a.id_usuario = u.id_usuario
            WHERE p.id_liga = $1
            ORDER BY p.jornada ASC
        `;
    const values = [id_liga];
    const rows = await executeQuery(query, values);
    return rows;
  }

  async getPartidosByEquipo(id_equipo: number): Promise<Partido[]> {
    const query = `
            SELECT
              p.id_partido, 
              p.jornada,
              TO_CHAR(p.fecha_partido, 'DD/MM/YYYY') as fecha_partido,
              p.hora_partido,
              p.goles_local,
              p.goles_visitante,
              el.nombre_equipo AS equipo_local,
              ev.nombre_equipo AS equipo_visitante,
              el.escudo AS escudo_local,
              ev.escudo AS escudo_visitante,
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
            WHERE p.equipo_local_id = $1 OR p.equipo_visitante_id = $1
            ORDER BY p.fecha_partido
        `;
    const values = [id_equipo];
    const rows = await executeQuery(query, values);
    return rows;
  }

  async registrarAlineacion(alineacion: AlineacionPartido): Promise<AlineacionPartido> {
    const query = `
          INSERT INTO alineaciones
            (id_partido, id_jugador, id_equipo, es_titular)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
    const values = [
      alineacion.id_partido,
      alineacion.id_jugador,
      alineacion.id_equipo,
      alineacion.es_titular,
    ];
    const rows = await executeQuery(query, values);
    return rows[0];
  }

  async getAlineacionesByPartido(id_partido: number): Promise<AlineacionPartido[]> {
    const query = `
          SELECT
            a.id_alineacion,
            a.id_partido,
            a.id_jugador,
            a.id_equipo,
            a.es_titular,
            u.nombre,
            u.apellidos,
            j.numero_camiseta AS dorsal,
            j.posicion
          FROM Alineaciones a
          JOIN Jugadores j ON a.id_jugador = j.id_jugador
          JOIN Usuarios u ON j.id_usuario = u.id_usuario
          WHERE a.id_partido = $1
          ORDER BY a.id_equipo, a.es_titular DESC, a.id_alineacion ASC;
        `;
    const values = [id_partido];
    const result = await executeQuery(query, values);
    return result;
  }

  async contarTitulares(id_partido: number, id_equipo: number): Promise<number> {
    const query = `
          SELECT COUNT(*) AS count
          FROM alineaciones
          WHERE id_partido = $1 AND id_equipo = $2 AND es_titular = true
        `;
    const values = [id_partido, id_equipo];
    const result = await executeQuery(query, values);
    const numeroTitulares = Number(result[0]?.count || 0);
    return numeroTitulares;
  }

  async contarSuplentes(id_partido: number, id_equipo: number): Promise<number> {
    const query = `
          SELECT COUNT(*) AS count
          FROM alineaciones
          WHERE id_partido = $1 AND id_equipo = $2 AND es_titular = false
        `;
    const values = [id_partido, id_equipo];
    const result = await executeQuery(query, values);
    const numeroSuplentes = Number(result[0]?.count || 0);
    return numeroSuplentes;
  }

  async borrarAlineacion(id_partido: number, id_jugador: number, id_equipo: number): Promise<void> {
    const query = `
          DELETE FROM alineaciones
          WHERE id_partido = $1 AND id_jugador = $2 AND id_equipo = $3
        `;
    const values = [id_partido, id_jugador, id_equipo];
    await executeQuery(query, values);
  }

  async getPartidosByArbitro(id_arbitro: number): Promise<Partido[]> {
    const query = `
            SELECT
              p.id_partido,
              p.id_arbitro,
              p.fecha_partido,
              p.hora_partido,
              p.equipo_local_id,  
              p.equipo_visitante_id,
              el.nombre_equipo AS equipo_local,
              el.escudo AS escudo_local,
              ev.nombre_equipo AS equipo_visitante,
              ev.escudo AS escudo_visitante,
              e.ubicacion AS ubicacion_estadio,
              p.jornada
            FROM Partidos p
            JOIN Equipos el ON p.equipo_local_id = el.id_equipo
            JOIN Equipos ev ON p.equipo_visitante_id = ev.id_equipo
            JOIN Estadios e ON p.id_estadio = e.id_estadio
            WHERE p.id_arbitro = $1
            ORDER BY p.jornada ASC;
        `
    const values = [id_arbitro];
    const result = await executeQuery(query, values);
    return result;
  }

  async registrarEstadisticas(partido: Partido, estadisticas: EstadisticasJugador[]): Promise<void> {
    // Aqui actualizo los goles del partido
    const queryUpdate = `
          UPDATE Partidos
          SET goles_local = $1, goles_visitante = $2
          WHERE id_partido = $3
        `;
    const valuesUpdate = [
      partido.goles_local,
      partido.goles_visitante,
      partido.id_partido
    ];
    await executeQuery(queryUpdate, valuesUpdate);

    // Aqui borro las estadísticas antiguas de ese partido
    const queryDelete = `
          DELETE FROM Estadisticas_Individuales
          WHERE id_partido = $1
        `;
    const valuesDelete = [partido.id_partido];
    await executeQuery(queryDelete, valuesDelete);

    // Aqui inserto las nuevas estadísticas
    for (const est of estadisticas) {
      const queryInsert = `
            INSERT INTO Estadisticas_Individuales
              (id_jugador, id_partido, goles, tarjetas_amarillas, tarjetas_rojas, mejor_jugador, titularidades)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `;
      const valuesInsert = [
        est.id_jugador,
        partido.id_partido,
        est.goles,
        est.tarjetas_amarillas,
        est.tarjetas_rojas,
        est.mejor_jugador,
        est.titularidades
      ];
      await executeQuery(queryInsert, valuesInsert);
    }
  }

  async getEstadisticasPartido(id_partido: number): Promise<EstadisticasPartidoCompleto | null> {
    const queryPartido = `
          SELECT
            p.id_partido,
            p.fecha_partido,
            p.hora_partido,
            p.goles_local,
            p.goles_visitante,
            p.jornada,
            el.id_equipo            AS equipo_local_id,
            el.nombre_equipo        AS equipo_local_nombre,
            el.escudo               AS equipo_local_escudo,
            ev.id_equipo            AS equipo_visitante_id,
            ev.nombre_equipo        AS equipo_visitante_nombre,
            ev.escudo               AS equipo_visitante_escudo,
            es.id_estadio,
            es.nombre               AS estadio_nombre,
            es.ubicacion            AS estadio_ubicacion,
            ua.id_usuario           AS arbitro_usuario_id,
            ua.nombre               AS arbitro_nombre,
            ua.apellidos            AS arbitro_apellidos
          FROM Partidos p
          JOIN Equipos el ON el.id_equipo       = p.equipo_local_id
          JOIN Equipos ev ON ev.id_equipo       = p.equipo_visitante_id
          JOIN Estadios es ON es.id_estadio     = p.id_estadio
          LEFT JOIN Arbitros a ON a.id_arbitro   = p.id_arbitro
          LEFT JOIN Usuarios ua ON ua.id_usuario = a.id_usuario
          WHERE p.id_partido = $1
        `;
    const valuesPartido = [id_partido];
    const rowsPartido = await executeQuery(queryPartido, valuesPartido);
    if (rowsPartido.length === 0) return null;
    const partido = rowsPartido[0];

    // Aqui saco las dos alineaciones
    const queryAlineacion = `
          SELECT
            a.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta AS dorsal,
            j.posicion,
            a.es_titular
          FROM Alineaciones a
          JOIN Jugadores j ON j.id_jugador = a.id_jugador
          JOIN Usuarios u  ON u.id_usuario  = j.id_usuario
          WHERE a.id_partido = $1
            AND a.id_equipo  = $2
          ORDER BY a.es_titular DESC, j.numero_camiseta
        `;
    const valuesAlineLocal = [id_partido, partido.equipo_local_id];
    const alineacionesLocal = await executeQuery(queryAlineacion, valuesAlineLocal);
    const valuesAlineVisi = [id_partido, partido.equipo_visitante_id];
    const alineacionesVisitante = await executeQuery(queryAlineacion, valuesAlineVisi);

    //Aqui saco los entrenadores
    const queryEntrenadores= `
    SELECT
      u.id_usuario,
      u.nombre,
      u.apellidos
    FROM Entrenadores e
    JOIN Usuarios u ON u.id_usuario = e.id_usuario
    WHERE e.id_equipo = $1
  `;
    const entrenadoresLocal = await executeQuery(queryEntrenadores, [partido.equipo_local_id]);
    const entrenadoresVisitante = await executeQuery(queryEntrenadores, [partido.equipo_visitante_id]);
    
    // Y aqui las estadisticas del partido
    const queryStats = `
          SELECT
            ei.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta AS dorsal,
            ei.goles,
            ei.tarjetas_amarillas,
            ei.tarjetas_rojas,
            ei.mejor_jugador
          FROM Estadisticas_Individuales ei
          JOIN Jugadores j ON j.id_jugador = ei.id_jugador
          JOIN Usuarios u  ON u.id_usuario  = j.id_usuario
          WHERE ei.id_partido = $1
            AND (ei.goles > 0 OR ei.tarjetas_amarillas > 0 OR ei.tarjetas_rojas > 0 OR ei.mejor_jugador)
          ORDER BY ei.mejor_jugador DESC, ei.goles DESC
        `;
    const valuesStats = [id_partido];
    const estadisticas = await executeQuery(queryStats, valuesStats);
    return {
      partido,
      entrenadoresLocal,
      entrenadoresVisitante,
      alineacionesLocal,
      alineacionesVisitante,
      estadisticas
    };
  }
}