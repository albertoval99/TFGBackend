import EstadisticasRepository from "../domain/estadisticas.repository";
import EstadisticasTotales from "../domain/EstadisticasTotales";

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

    async getMaximoGoleador(): Promise<EstadisticasTotales> {
        const maximoGoleador = await this.estadisticasRepository.getMaximoGoleador();
        if (!maximoGoleador) {
            console.log("❌ No se encontró ningún máximo goleador");
            throw { message: "No se encontró ningún máximo goleador" };
        }
        return maximoGoleador;
    }

    async getMaximosGoleadores(): Promise<EstadisticasTotales[]> {
        const maximosGoleadores = await this.estadisticasRepository.getMaximosGoleadores();
        if (!maximosGoleadores || maximosGoleadores.length === 0) {
            console.log("❌ No se encontraron máximos goleadores");
            throw { message: "No se encontraron máximos goleadores" };
        }
        return maximosGoleadores;
    }

    async getMejorJugador(): Promise<EstadisticasTotales> {
        const mejorJugador = await this.estadisticasRepository.getMejorJugador();
        if (!mejorJugador) {
            console.log("❌ No se encontró ningún mejor jugador");
            throw { message: "No se encontró ningún mejor jugador" };
        }
        return mejorJugador;
    }

    async getMejoresJugadores(): Promise<EstadisticasTotales[]> {
        const mejoresJugadores = await this.estadisticasRepository.getMejoresJugadores();
        if (!mejoresJugadores || mejoresJugadores.length === 0) {
            console.log("❌ No se encontraron mejores jugadores");
            throw { message: "No se encontraron mejores jugadores" };
        }
        return mejoresJugadores;
    }

    async getJugadorConMasAmarillas(): Promise<EstadisticasTotales> {
        const jugadorConMasAmarillas = await this.estadisticasRepository.getJugadorConMasAmarillas();
        if (!jugadorConMasAmarillas) {
            console.log("❌ No se encontró ningún jugador con tarjetas amarillas");
            throw { message: "No se encontró ningún jugador con tarjetas amarillas" };
        }
        return jugadorConMasAmarillas;
    }

    async getJugadoresConMasAmarillas(): Promise<EstadisticasTotales[]> {
        const jugadoresConMasAmarillas = await this.estadisticasRepository.getJugadoresConMasAmarillas();
        if (!jugadoresConMasAmarillas || jugadoresConMasAmarillas.length === 0) {
            console.log("❌ No se encontraron jugadores con tarjetas amarillas");
            throw { message: "No se encontraron jugadores con tarjetas amarillas" };
        }
        return jugadoresConMasAmarillas;
    }

    async getJugadorConMasRojas(): Promise<EstadisticasTotales> {
        const jugadorConMasRojas = await this.estadisticasRepository.getJugadorConMasRojas();
        if (!jugadorConMasRojas) {
            console.log("❌ No se encontró ningú jugador con tarjetas rojas");
            throw { message: "No se encontró ningú jugador con tarjetas rojas" };
        }
        return jugadorConMasRojas;
    }

    async getJugadoresConMasRojas(): Promise<EstadisticasTotales[]> {
        const jugadoresConMasRojas = await this.estadisticasRepository.getJugadoresConMasRojas();
        if (!jugadoresConMasRojas || jugadoresConMasRojas.length === 0) {
            console.log("❌ No se encontraron jugadores con tarjetas rojas");
            throw { message: "No se encontraron jugadores con tarjetas rojas" };
        }
        return jugadoresConMasRojas;
    }

    async getJugadorConMasTitularidades(): Promise<EstadisticasTotales> {
        const jugadorConMasTitularidades = await this.estadisticasRepository.getJugadorConMasTitularidades();
        if (!jugadorConMasTitularidades) {
            console.log("❌ No se encontró ningún jugador con titularidades");
            throw { message: "No se encontró ningún jugador con titularidades" };
        }
        return jugadorConMasTitularidades;
    }

    async getJugadoresConMasTitularidades(): Promise<EstadisticasTotales[]> {
        const jugadoresConMasTitularidades = await this.estadisticasRepository.getJugadoresConMasTitularidades();
        if (!jugadoresConMasTitularidades || jugadoresConMasTitularidades.length === 0) {
            console.log("❌ No se encontraron jugadores con titularidades");
            throw { message: "No se encontraron jugadores con titularidades" };
        }
        return jugadoresConMasTitularidades;
    }
}