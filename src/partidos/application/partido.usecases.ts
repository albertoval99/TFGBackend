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

            console.log(`✅ Partido ${id_partido} actualizado correctamente`);
            return partidoActualizado;

        } catch (error) {
            console.error(`❌ Error al actualizar el partido: ${error.message}`);
            throw { message: error.message || "Error al actualizar el partido" };
        }
    }
}