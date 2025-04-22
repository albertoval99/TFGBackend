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
}