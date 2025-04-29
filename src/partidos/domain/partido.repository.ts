import Partido from "./Partido";

export default interface PartidoRepository {
    getPartidoById(id_partido: number): Promise<Partido | null>;
    getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]>
    updatePartido(id_partido: number,fecha_partido: string,hora_partido: string,id_estadio: number): Promise<Partido>

}