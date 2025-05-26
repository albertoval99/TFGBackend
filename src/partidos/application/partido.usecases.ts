import AlineacionPartido from "../domain/AlineacionPartido";
import EstadisticasJugador from "../domain/EstadisticasJugador";
import EstadisticasPartidoCompleto from "../domain/EstadisticasPartidoCompleto";
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

    async updatePartido(id_partido: number, fecha_partido: string, hora_partido: string, id_estadio: number): Promise<Partido> {
        try {
            if (!id_partido) {
                console.log("❌ Falta el id del partido");
                throw { message: "Falta el id del partido" };
            }
            const partidoExistente = await this.partidoRepository.getPartidoById(id_partido);
            if (!partidoExistente) {
                console.log(`❌ No se encontró el partido con id: ${id_partido}`);
                throw { message: "Partido no encontrado" };
            }
            if (fecha_partido === null && hora_partido === null && id_estadio === null) {
                console.log("❌ No se proporcionó ningún campo para actualizar");
                throw { message: "Debe proporcionar al menos un campo para actualizar" };
            }
            if (fecha_partido !== null) {
                const fechaValida = !isNaN(Date.parse(fecha_partido));
                if (!fechaValida) {
                    console.log("❌ Formato de fecha inválido");
                    throw { message: "El formato de la fecha debe ser YYYY-MM-DD" };
                }
            }
            if (hora_partido !== null) {
                // Verificar formato de hora (HH:MM)
                const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!horaRegex.test(hora_partido)) {
                    console.log("❌ Formato de hora inválido");
                    throw { message: "El formato de la hora debe ser HH:MM" };
                }
            }
            if (id_estadio !== null) {
                if (id_estadio <= 0) {
                    console.log("❌ ID de estadio inválido");
                    throw { message: "El ID del estadio debe ser un número positivo" };
                }
            }
            const partidoActualizado = await this.partidoRepository.updatePartido(
                id_partido,
                fecha_partido,
                hora_partido,
                id_estadio
            );
            if (!partidoActualizado) {
                throw { message: "Error al actualizar el partido" };
            }
            return partidoActualizado;

        } catch (error) {
            console.error(`❌ Error al actualizar el partido: ${error.message}`);
            throw { message: "Error al actualizar el partido" };
        }
    }


    async getPartidosByLiga(id_liga: number): Promise<Partido[]> {
        try {
            if (!id_liga) {
                console.log("❌ Falta el id de la liga");
                throw { message: "Falta el id de la liga" };
            }
            const partidos = await this.partidoRepository.getPartidosByLiga(id_liga);
            if (!partidos || partidos.length === 0) {
                console.log(`❌ No se encontraron partidos para la liga ${id_liga}`);
                throw { message: "No se encontraron partidos para esta liga" };
            }
            return partidos;

        } catch (error) {
            console.error(`❌ Error al obtener los partidos de la liga: ${error.message}`);
            throw error;
        }

    }

    async getPartidosByEquipo(id_equipo: number): Promise<Partido[]> {
        if (!id_equipo) {
            console.log("❌ Falta el id del equipo");
            throw { message: "Falta el id del equipo" };
        }
        const partidos = await this.partidoRepository.getPartidosByEquipo(id_equipo);
        if (!partidos || partidos.length === 0) {
            console.log(`❌ No se encontraron partidos para el equipo ${id_equipo}`);
            throw { message: "No se encontraron partidos para este equipo" };
        }
        return partidos;
    }

    async getAlineacionesByPartido(id_partido: number): Promise<AlineacionPartido[]> {
        if (!id_partido) {
            console.log("❌ Falta el id del partido");
            throw { message: "Falta id del partido" };
        }
        const alineaciones = await this.partidoRepository.getAlineacionesByPartido(id_partido);
        if (!alineaciones || alineaciones.length === 0) {
            console.log(`❌ No se encontraron alineaciones para el partido ${id_partido}`);
            throw { message: "No se encontraron alineaciones para este partido" };
        }

        return alineaciones;
    }
    async registrarAlineacion(alineacion: AlineacionPartido): Promise<AlineacionPartido> {
        if (!alineacion.id_partido) throw { message: "Falta el id del partido" };
        if (!alineacion.id_jugador) throw { message: "Falta el id del jugador" };
        if (alineacion.es_titular === undefined) throw { message: "Falta 'es_titular'" };
        if (!alineacion.id_equipo) throw { message: "Falta el id del equipo" };

        // Borro la alineación previa para poder reescribir
        await this.partidoRepository.borrarAlineacion(alineacion.id_partido, alineacion.id_jugador, alineacion.id_equipo);

        const countTitulares = await this.partidoRepository.contarTitulares(alineacion.id_partido, alineacion.id_equipo);
        const countSuplentes = await this.partidoRepository.contarSuplentes(alineacion.id_partido, alineacion.id_equipo);

        if (alineacion.es_titular && countTitulares >= 11) {
            throw { message: "Ya hay 11 titulares registrados" };
        }
        if (!alineacion.es_titular && countSuplentes >= 7) {
            throw { message: "Ya hay 7 suplentes registrados" };
        }
        return await this.partidoRepository.registrarAlineacion(alineacion);
    }

    async getPartidosByArbitro(id_arbitro: number): Promise<Partido[]> {
        if (!id_arbitro) {
            console.log("❌ Falta el id del árbitro");
            throw { message: "Falta id del árbitro" };
        }
        const partidos = await this.partidoRepository.getPartidosByArbitro(id_arbitro);
        if (!partidos || partidos.length === 0) {
            console.log(`❌ No se encontraron partidos para el árbitro ${id_arbitro}`);
            throw { message: "No se encontraron partidos para este árbitro" };
        }
        return partidos;
    }

    async registrarEstadisticas(partido: Partido, estadisticas: EstadisticasJugador[]): Promise<void> {
        if (!partido || !partido.id_partido) {
            console.log("❌ Falta el partido o su id");
            throw { message: "Falta el partido o su id" };
        }
        if (partido.goles_local == null || partido.goles_visitante == null) {
            console.log("❌ Faltan goles del partido");
            throw { message: "Faltan goles del partido" };
        }
        if (!Array.isArray(estadisticas) || estadisticas.length === 0) {
            console.log("❌ Faltan estadísticas individuales");
            throw { message: "Faltan estadísticas individuales" };
        }
        for (const est of estadisticas) {
            if (est.goles < 0 || est.tarjetas_amarillas < 0 || est.tarjetas_rojas < 0) {
                console.log("❌ Valores negativos en estadísticas");
                throw { message: "Los valores de goles y tarjetas no pueden ser negativos" };
            }
        }
        await this.partidoRepository.registrarEstadisticas(partido, estadisticas);
    }

    async getEstadisticasByPartido(id_partido: number): Promise<EstadisticasPartidoCompleto> {
        if (!id_partido) {
            console.log("❌ Falta id del partido");
            throw { message: "Falta id del partido" };
        }
        const partidoCompleto = await this.partidoRepository.getEstadisticasPartido(id_partido);
        return partidoCompleto;
    }
}