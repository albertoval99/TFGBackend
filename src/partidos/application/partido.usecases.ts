import Partido from "../domain/Partido";
import PartidoRepository from "../domain/partido.repository";

export default class PartidoUseCases {
    private partidoRepository: PartidoRepository;

    constructor(partidoRepository: PartidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    async getPartidoById(id_partido: number): Promise<Partido | null> {
        const partido = await this.partidoRepository.getPartidoById(id_partido);
        if (!partido) {
            console.log(`❌No se encontró el partido con id: ${id_partido}`);
            throw new Error("Partido no encontrado");
        }
        return partido;
    }
}