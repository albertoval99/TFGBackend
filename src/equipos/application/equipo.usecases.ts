import Equipo from "../domain/Equipo";
import EquipoRepository from "../domain/equipo.repository";

export default class EquipoUseCases {
    private equipoRepository: EquipoRepository;

    constructor(equipoRepository: EquipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    async getEquipos(): Promise<Equipo[]> {
        const equipos = await this.equipoRepository.getEquipos();
        if (equipos && equipos.length > 0) {
            return equipos;
        } else {            
            throw { message: "No se encontraron equipos" };
        }
    }
}