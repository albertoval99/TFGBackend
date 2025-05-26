import EstadisticasRepository from "../../domain/estadisticas.repository";
import { executeQuery } from '../../../context/db/postgres.db';
import EstadisticasTotales from "../../domain/EstadisticasTotales";
export default class EstadisticasRepositoryPostgres implements EstadisticasRepository {
    async getEstadisticasJugador(id_jugador: number): Promise<EstadisticasTotales> {
        const queryJugador = `
        SELECT 
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        WHERE j.id_jugador = $1
    `;
        const jugador = (await executeQuery(queryJugador, [id_jugador]))[0]; //[0]-> primer resultado del array

        // Obtengo las estadísticas sumadas
        const queryEstadisticas = `
        SELECT 
            SUM(goles) as total_goles,
            SUM(tarjetas_amarillas) as total_tarjetas_amarillas,
            SUM(tarjetas_rojas) as total_tarjetas_rojas,
            SUM(CASE WHEN mejor_jugador THEN 1 ELSE 0 END) as total_mejor_jugador
        FROM Estadisticas_Individuales
        WHERE id_jugador = $1
    `;
        const estadisticas = (await executeQuery(queryEstadisticas, [id_jugador]))[0];

        // Obtengo el total de titularidades
        const queryTitularidades = `
        SELECT COUNT(*) as total_titularidades
        FROM Alineaciones
        WHERE id_jugador = $1 AND es_titular = true
    `;
        const titularidades = (await executeQuery(queryTitularidades, [id_jugador]))[0];

        return {
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            goles: estadisticas.total_goles || 0,
            tarjetas_amarillas: estadisticas.total_tarjetas_amarillas || 0,
            tarjetas_rojas: estadisticas.total_tarjetas_rojas || 0,
            mejor_jugador: estadisticas.total_mejor_jugador || 0,
            titularidades: titularidades.total_titularidades || 0
        };
    }

    async getMaximosGoleadores(): Promise<EstadisticasTotales[]> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(ei.goles) as goles
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY goles DESC
        `;

        const resultado = await executeQuery(query, []);
        // Solo los que han metido mas de uno:
        const goleadores = resultado.filter(j => j.goles > 0);

        return goleadores.map(jugador => ({
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            goles: jugador.goles
        }));
    }

    async getMaximoGoleador(): Promise<EstadisticasTotales> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(ei.goles) as goles
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY goles DESC
        LIMIT 1
        `;
        const result = await executeQuery(query);
        return result[0];
    }

    async getMejorJugador(): Promise<EstadisticasTotales> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(CASE WHEN ei.mejor_jugador THEN 1 ELSE 0 END) as mejor_jugador
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY mejor_jugador DESC
        LIMIT 1
    `;
        const result = await executeQuery(query);
        return result[0];
    }

    async getMejoresJugadores(): Promise<EstadisticasTotales[]> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(CASE WHEN ei.mejor_jugador THEN 1 ELSE 0 END) as mejor_jugador
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        HAVING SUM(CASE WHEN ei.mejor_jugador THEN 1 ELSE 0 END) > 0
        ORDER BY mejor_jugador DESC
    `;
        const result = await executeQuery(query);
        return result.map(jugador => ({
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            mejor_jugador: jugador.mejor_jugador
        }));
    }

    async getJugadorConMasAmarillas(): Promise<EstadisticasTotales> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(ei.tarjetas_amarillas) as tarjetas_amarillas
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY tarjetas_amarillas DESC
        LIMIT 1
    `;
        const result = await executeQuery(query);
        return result[0];
    }

    async getJugadoresConMasAmarillas(): Promise<EstadisticasTotales[]> {
        const query = `
            SELECT
                j.id_jugador,
                u.nombre,
                u.apellidos,
                j.numero_camiseta as dorsal,
                e.nombre_equipo,
                e.escudo,
                SUM(ei.tarjetas_amarillas) as tarjetas_amarillas
            FROM Jugadores j
            JOIN Usuarios u ON j.id_usuario = u.id_usuario
            JOIN Equipos e ON j.id_equipo = e.id_equipo
            JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
            GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
            HAVING SUM(ei.tarjetas_amarillas) > 0
            ORDER BY tarjetas_amarillas DESC
        `;
        const result = await executeQuery(query);
        return result.map(jugador => ({
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            tarjetas_amarillas: jugador.tarjetas_amarillas
        }));
    }

    async getJugadorConMasRojas(): Promise<EstadisticasTotales> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            SUM(ei.tarjetas_rojas) as tarjetas_rojas
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY tarjetas_rojas DESC
        LIMIT 1
    `;
        const result = await executeQuery(query);
        return result[0];
    }

    async getJugadoresConMasRojas(): Promise<EstadisticasTotales[]> {
        const query = `
            SELECT
                j.id_jugador,
                u.nombre,
                u.apellidos,
                j.numero_camiseta as dorsal,
                e.nombre_equipo,
                e.escudo,
                SUM(ei.tarjetas_rojas) as tarjetas_rojas
            FROM Jugadores j
            JOIN Usuarios u ON j.id_usuario = u.id_usuario
            JOIN Equipos e ON j.id_equipo = e.id_equipo
            JOIN Estadisticas_Individuales ei ON j.id_jugador = ei.id_jugador
            GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
            HAVING SUM(ei.tarjetas_rojas) > 0
            ORDER BY tarjetas_rojas DESC
        `;
        const result = await executeQuery(query);
        return result.map(jugador => ({
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            tarjetas_rojas: jugador.tarjetas_rojas
        }));
    }

    async getJugadorConMasTitularidades(): Promise<EstadisticasTotales> {
        const query = `
            SELECT
                j.id_jugador,
                u.nombre,
                u.apellidos,
                j.numero_camiseta as dorsal,
                e.nombre_equipo,
                e.escudo,
                COUNT(*) as titularidades
            FROM Jugadores j
            JOIN Usuarios u ON j.id_usuario = u.id_usuario
            JOIN Equipos e ON j.id_equipo = e.id_equipo
            JOIN Alineaciones a ON j.id_jugador = a.id_jugador
            WHERE a.es_titular = true
            GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
            ORDER BY titularidades DESC
            LIMIT 1
        `;
        const result = await executeQuery(query);
        return result[0];
    }

    async getJugadoresConMasTitularidades(): Promise<EstadisticasTotales[]> {
        const query = `
        SELECT
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta as dorsal,
            e.nombre_equipo,
            e.escudo,
            COUNT(*) as titularidades
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        JOIN Equipos e ON j.id_equipo = e.id_equipo
        JOIN Alineaciones a ON j.id_jugador = a.id_jugador
        WHERE a.es_titular = true
        GROUP BY j.id_jugador, u.nombre, u.apellidos, j.numero_camiseta, e.nombre_equipo, e.escudo
        ORDER BY titularidades DESC
    `;
        const result = await executeQuery(query);
        return result.map(jugador => ({
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            dorsal: jugador.dorsal,
            nombre_equipo: jugador.nombre_equipo,
            escudo: jugador.escudo,
            titularidades: jugador.titularidades
        }));
    }
}