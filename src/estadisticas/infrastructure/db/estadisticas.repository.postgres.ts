import EstadisticasRepository from "../../domain/estadisticas.repository";
import { EstadisticasTotales } from "../../domain/EstadisticasTotales";
import { executeQuery } from '../../../context/db/postgres.db';

export default class EstadisticasRepositoryPostgres implements EstadisticasRepository {
    async getEstadisticasJugador(id_jugador: number): Promise<EstadisticasTotales> {
        const queryJugador = `
        SELECT 
            j.id_jugador,
            u.nombre,
            u.apellidos,
            j.numero_camiseta 
        FROM Jugadores j
        JOIN Usuarios u ON j.id_usuario = u.id_usuario
        WHERE j.id_jugador = $1
    `;
        const jugador = (await executeQuery(queryJugador, [id_jugador]))[0];

        if (!jugador) {
            throw new Error('Jugador no encontrado');
        }

        // 2. Obtener estadísticas sumadas
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

        // 3. Obtener total de titularidades
        const queryTitularidades = `
        SELECT COUNT(*) as total_titularidades
        FROM Alineaciones
        WHERE id_jugador = $1 AND es_titular = true
    `;
        const titularidades = (await executeQuery(queryTitularidades, [id_jugador]))[0];

        // 4. Combinar todos los datos
        return {
            id_jugador: jugador.id_jugador,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            numero_camiseta: jugador.numero_camiseta,
            goles: estadisticas.total_goles || 0,
            tarjetas_amarillas: estadisticas.total_tarjetas_amarillas || 0,
            tarjetas_rojas: estadisticas.total_tarjetas_rojas || 0,
            mejor_jugador: estadisticas.total_mejor_jugador || 0,
            titularidades: titularidades.total_titularidades || 0
        };
    }
}