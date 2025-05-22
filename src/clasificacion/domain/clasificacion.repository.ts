import EmpatesPorEquipo from "./EmpatesPorEquipo";
import GolesContraPorEquipo from "./GolesContraPorEquipo";
import GolesFavorPorEquipo from "./GolesFavorPorEquipo";
import PartidosJugados from "./PartidosJugados";
import VictoriasPorEquipo from "./VictoriasPorEquipo";

export default interface ClasificacionRepository {
    getPartidosJugadosPorEquipo(id_liga: number): Promise<PartidosJugados[]>;
    getVictoriasPorEquipo(id_liga: number): Promise<VictoriasPorEquipo[]>;
    getEmpatesPorEquipo(id_liga: number): Promise<EmpatesPorEquipo[]>;
    getGolesFavorPorEquipo(id_liga: number): Promise<GolesFavorPorEquipo[]>;
    getGolesContraPorEquipo(id_liga: number): Promise<GolesContraPorEquipo[]>
}