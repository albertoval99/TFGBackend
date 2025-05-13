import Jugador from "../../usuarios/domain/Jugador";
import Equipo from "./Equipo";
import Estadio from './Estadio';

export default interface EquipoRepository{
    getEquipos():Promise<Equipo[]>
    getEquipoById(id_equipo: number): Promise<Equipo|null>;
    registrarEquipo(equipo:Equipo):Promise<Equipo>;
    getEquipoByNombre(nombre_equipo: string, id_liga: number): Promise<Equipo | null>;
    getAllEstadios():Promise<Estadio[]>
    getJugadoresByEquipo(id_equipo: number): Promise<Jugador[]>
}