import Partido from "./Partido";

export default interface PartidoRepository {
    getPartidoById(id_partido: number): Promise<Partido|null>;
    
}