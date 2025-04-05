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
    async getEquipoById(id_equipo: number): Promise<Equipo | null> {
        const equipo=await this.equipoRepository.getEquipoById(id_equipo);
        if(!equipo){
            console.log(`❌No se encontró el equipo con id: ${id_equipo}`);
            throw new Error("Equipo no encontrado");
        }
        console.log("✅ Equipo encontrado:",equipo);
        return equipo;
    }
}