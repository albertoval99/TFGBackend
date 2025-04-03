import Equipo from "./Equipo";

export default interface EquipoRepository{
    getEquipos():Promise<Equipo[]>
}