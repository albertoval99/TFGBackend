import { EstadisticasTotales } from './EstadisticasTotales';
export default interface EstadisticasRepository {
    getEstadisticasJugador(id_jugador: number): Promise<EstadisticasTotales>
}