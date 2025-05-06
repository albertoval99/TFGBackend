import Partido from "./Partido";

export default interface PartidoRepository {
    getPartidoById(id_partido: number): Promise<Partido | null>;
    getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]>
    updatePartido(id_partido: number, fecha_partido: string | null, hora_partido: string | null, id_estadio: number | null): Promise<Partido>
    getPartidosByLiga(id_liga: number): Promise<Partido[]>
}