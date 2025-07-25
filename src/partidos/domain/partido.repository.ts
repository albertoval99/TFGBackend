import AlineacionPartido from './AlineacionPartido';
import EstadisticasJugador from './EstadisticasJugador';
import EstadisticasPartidoCompleto from './EstadisticasPartidoCompleto';
import Partido from './Partido';
export default interface PartidoRepository {
    getPartidoById(id_partido: number): Promise<Partido | null>;
    getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]>;
    updatePartido(id_partido: number, fecha_partido: string | null, hora_partido: string | null, id_estadio: number | null): Promise<Partido>;
    getPartidosByLiga(id_liga: number): Promise<Partido[]>;
    getPartidosByEquipo(id_equipo: number): Promise<Partido[]>;
    registrarAlineacion(alineaciones: AlineacionPartido): Promise<AlineacionPartido>;
    getAlineacionesByPartido(id_partido: number): Promise<AlineacionPartido[]>;
    contarTitulares(id_partido: number, id_equipo: number): Promise<number>;
    contarSuplentes(id_partido: number, id_equipo: number): Promise<number>;
    borrarAlineacion(id_partido: number, id_jugador: number, id_equipo: number): Promise<void>;
    getPartidosByArbitro(id_arbitro: number): Promise<Partido[]>;
    registrarEstadisticas(partido: Partido, estadisticas: EstadisticasJugador[]): Promise<void>;
    getEstadisticasPartido(id_partido: number): Promise<EstadisticasPartidoCompleto | null>;
}