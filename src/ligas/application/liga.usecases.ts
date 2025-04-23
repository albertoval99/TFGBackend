import Liga from "../domain/Liga";
import LigaRepository from "../domain/liga.repository";

export default class LigaUseCases {
    private ligaRepository: LigaRepository;

    constructor(ligaRepository: LigaRepository) {
        this.ligaRepository = ligaRepository;
    }

    async registroLiga(liga: Liga): Promise<Liga> {
        if (!liga.nombre_liga) {
            console.log("❌ Falta el nombre de la liga");
            throw { message: "Falta el nombre de la liga" };
        }
        if (!liga.categoria) {
            console.log("❌ Falta la categoría de la liga");
            throw { message: "Falta la categoría de la liga" };
        }
        if (!liga.grupo) {
            console.log("❌ Falta el grupo de la liga");
            throw { message: "Falta el grupo de la liga" };
        }
        if (!liga.temporada) {
            console.log("❌ Falta la temporada de la liga");
            throw { message: "Falta la temporada de la liga" };
        }

        const ligaRegistrada = await this.ligaRepository.registrarLiga(liga);

        return ligaRegistrada;
    }

    async getLigas(): Promise<Liga[]> {
        const ligas = await this.ligaRepository.getLigas();
        if (ligas && ligas.length > 0) {
            return ligas;
        } else {
            throw { message: "No se encontraron ligas" };
        }
    }

    async getLigaById(id_liga: number): Promise<Liga | null> {
        const liga = await this.ligaRepository.getLigaById(id_liga);
        if (!liga) {
            console.log(`❌No se encontró la liga con id: ${id_liga}`);
            throw new Error("Liga no encontrada");
        }
        return liga;
    }
}