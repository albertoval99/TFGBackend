import EstadisticasRepository from "../domain/estadisticas.repository";
import { EstadisticasTotales } from "../domain/EstadisticasTotales";

export default class EstadisticasUseCases {
    private estadisticasRepository: EstadisticasRepository;

    constructor(estadisticasRepository: EstadisticasRepository) {
        this.estadisticasRepository = estadisticasRepository;
    }

    async getEstadisticasJugador(id_jugador: number): Promise<EstadisticasTotales> {
        if (!id_jugador) {
            console.log("❌ Falta el id del jugador");
            throw { message: "Falta el id del jugador" };
        }

        const estadisticas = await this.estadisticasRepository.getEstadisticasJugador(id_jugador);
        if (!estadisticas) {
            console.log(`❌ No se encontraron estadísticas para el jugador ${id_jugador}`);
            throw { message: "No se encontraron estadísticas para este jugador" };
        }
        return estadisticas;
    }
}