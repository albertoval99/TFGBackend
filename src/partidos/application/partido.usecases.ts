import Partido from "../domain/Partido";
import PartidoRepository from "../domain/partido.repository";

export default class PartidoUseCases {
    private partidoRepository: PartidoRepository;

    constructor(partidoRepository: PartidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    async getPartidoById(id_partido: number): Promise<Partido | null> {
        if (!id_partido) {
            console.log("❌ Falta el id del partido");
            throw { message: "Falta el id del partido" };
        }
        const partido = await this.partidoRepository.getPartidoById(id_partido);
        if (!partido) {
            console.log(`❌ No se encontró el partido con id: ${id_partido}`);
            throw { message: "Partido no encontrado" };
        }
        return partido;
    }

    async getPartidosByJornada(id_liga: number, jornada: number): Promise<Partido[]> {
        if (!id_liga) {
            console.log("❌ Falta el id de la liga");
            throw { message: "Falta el id de la liga" };
        }
        if (!jornada && jornada !== 0) {
            console.log("❌ Falta la jornada");
            throw { message: "Falta la jornada" };
        }
        const partidos = await this.partidoRepository.getPartidosByJornada(id_liga, jornada);
        if (partidos && partidos.length > 0) {
            return partidos;
        } else {
            console.log(`❌ No se encontraron partidos para la liga ${id_liga} en la jornada ${jornada}`);
            throw { message: "No se encontraron partidos para esta jornada" };
        }
    }
}