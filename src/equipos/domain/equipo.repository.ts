import Equipo from "./Equipo";

export default interface EquipoRepository{
    getEquipos():Promise<Equipo[]>
    getEquipoById(id_equipo: number): Promise<Equipo|null>;
}