import Entrenamiento from "../domain/Entrenamiento";
import Asistencias from "../domain/Asistencias";
import EntrenamientoRepository from "../domain/entrenamiento.repository";

export default class EntrenamientoUseCases {
    private entrenamientoRepository: EntrenamientoRepository;

    constructor(entrenamientoRepository: EntrenamientoRepository) {
        this.entrenamientoRepository = entrenamientoRepository;
    }

    async crearEntrenamiento(entrenamiento: Entrenamiento): Promise<Entrenamiento> {
        if (!entrenamiento.fecha_hora_entrenamiento) {
            throw new Error("La fecha y hora del entrenamiento son obligatorias");
        }
        if (!entrenamiento.id_equipo) {
            throw new Error("El ID del equipo es obligatorio");
        }
        if (!entrenamiento.duracion) {
            throw new Error("La duración del entrenamiento es obligatoria");
        }

        if (new Date(entrenamiento.fecha_hora_entrenamiento) <= new Date()) {
            throw new Error("La fecha del entrenamiento debe ser futura");
        }

        const entrenamientoCreado = await this.entrenamientoRepository.crearEntrenamiento(entrenamiento);

        if (!entrenamientoCreado.id_entrenamiento) {
            throw new Error("Error al crear el entrenamiento: no se generó un ID");
        }

        await this.entrenamientoRepository.crearAsistenciasJugadores(
            entrenamientoCreado.id_entrenamiento,
            entrenamientoCreado.id_equipo
        );

        return entrenamientoCreado;
    }

    async eliminarEntrenamiento(id_entrenamiento: number, id_equipo: number): Promise<boolean> {
        const eliminado = await this.entrenamientoRepository.eliminarEntrenamiento(id_entrenamiento, id_equipo);
        if (!eliminado) {
            throw new Error("No se pudo eliminar el entrenamiento o ya ha pasado la fecha");
        }
        return true;
    }

    async getEntrenamientosEquipo(id_equipo: number): Promise<Entrenamiento[]> {
        const entrenamientos = await this.entrenamientoRepository.getEntrenamientosEquipo(id_equipo);
        if (!entrenamientos || entrenamientos.length === 0) {
            throw new Error("No hay entrenamientos futuros para este equipo");
        }
        return entrenamientos;
    }

    async actualizarAsistencia(id_entrenamiento: number, id_jugador: number, asistio: boolean, justificacion?: string): Promise<Asistencias> {
        const asistencia = await this.entrenamientoRepository.actualizarAsistencia(
            id_entrenamiento,
            id_jugador,
            asistio,
            justificacion
        );

        if (!asistencia) {
            throw new Error("No se pudo actualizar la asistencia o el entrenamiento ya no esta disponible");
        }

        return asistencia;
    }

    async getAsistenciasEntrenamiento(id_entrenamiento: number): Promise<Asistencias[]> {
        const asistencias = await this.entrenamientoRepository.getAsistenciasEntrenamiento(id_entrenamiento);
        if (!asistencias || asistencias.length === 0) {
            throw new Error("No hay asistencias registradas para este entrenamiento");
        }
        return asistencias;
    }
}