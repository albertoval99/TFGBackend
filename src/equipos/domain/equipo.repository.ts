import Equipo from "./Equipo";

export default interface EquipoRepository{
    getEquipos():Promise<Equipo[]>
    getEquipoById(id_equipo: number): Promise<Equipo|null>;
    registrarEquipo(equipo:Equipo):Promise<Equipo>;
    getEquipoByNombre(nombre_equipo: string, id_liga: number): Promise<Equipo | null>;
}