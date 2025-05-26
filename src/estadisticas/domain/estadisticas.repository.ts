import EstadisticasTotales from "./EstadisticasTotales"
export default interface EstadisticasRepository {
    getEstadisticasJugador(id_jugador: number): Promise<EstadisticasTotales>
    getMaximosGoleadores(): Promise<EstadisticasTotales[]>
    getMaximoGoleador(): Promise<EstadisticasTotales>
    getMejorJugador(): Promise<EstadisticasTotales>
    getMejoresJugadores(): Promise<EstadisticasTotales[]>
    getJugadorConMasAmarillas(): Promise<EstadisticasTotales>
    getJugadoresConMasAmarillas(): Promise<EstadisticasTotales[]>
    getJugadorConMasRojas(): Promise<EstadisticasTotales>
    getJugadoresConMasRojas(): Promise<EstadisticasTotales[]>
    getJugadorConMasTitularidades(): Promise<EstadisticasTotales>
    getJugadoresConMasTitularidades(): Promise<EstadisticasTotales[]>
}