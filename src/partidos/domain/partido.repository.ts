import Partido from "./Partido";
import AlineacionPartido from './AlineacionesPartido';

export default interface PartidoRepository {
    getPartidoById(id_partido: number): Promise<Partido | null>;
    getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]>
    updatePartido(id_partido: number, fecha_partido: string | null, hora_partido: string | null, id_estadio: number | null): Promise<Partido>
    getPartidosByLiga(id_liga: number): Promise<Partido[]>
    getPartidosByEquipo(id_equipo: number): Promise<Partido[]>
    registrarAlineacion(alineaciones: AlineacionPartido): Promise<AlineacionPartido>;
    getAlineacionesByPartido(id_partido: number): Promise<AlineacionPartido[]>;
}