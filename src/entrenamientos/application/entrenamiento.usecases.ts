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
            console.log("❌ La fecha y hora del entrenamiento son obligatorias");
            throw { message: "La fecha y hora del entrenamiento son obligatorias" };
        }
        if (!entrenamiento.id_equipo) {
            console.log("❌ El ID del equipo es obligatorio");
            throw { message: "El ID del equipo es obligatorio" };
        }
        if (!entrenamiento.duracion) {
            console.log("❌ La duración del entrenamiento es obligatoria");
            throw { message: "La duración del entrenamiento es obligatoria" };
        }
        if (new Date(entrenamiento.fecha_hora_entrenamiento) <= new Date()) {
            console.log("❌ La fecha del entrenamiento tiene que ser proxima a la hora actual");
            throw { message: "La fecha del entrenamiento tiene que ser proxima a la hora actual" };
        }

        const entrenamientoCreado = await this.entrenamientoRepository.crearEntrenamiento(entrenamiento);
        await this.entrenamientoRepository.crearAsistenciasJugadores(
            entrenamientoCreado.id_entrenamiento,
            entrenamientoCreado.id_equipo
        );

        return entrenamientoCreado;
    }

    async eliminarEntrenamiento(id_entrenamiento: number, id_equipo: number): Promise<boolean> {
        const eliminado = await this.entrenamientoRepository.eliminarEntrenamiento(id_entrenamiento, id_equipo);
        if (!eliminado) {
            console.log("❌ No se pudo eliminar el entrenamiento o ya ha pasado la fecha");
            throw { message: "No se pudo eliminar el entrenamiento o ya ha pasado la fecha" };
        }
        return true;
    }

    async getEntrenamientosEquipo(id_equipo: number): Promise<Entrenamiento[]> {
        const entrenamientos = await this.entrenamientoRepository.getEntrenamientosEquipo(id_equipo);
        if (!entrenamientos || entrenamientos.length === 0) {
            console.log("❌ No hay entrenamientos planificados");
            throw { message: "No hay entrenamientos planificados" };
        }
        return entrenamientos;
    }

    async actualizarAsistencia(id_entrenamiento: number, id_usuario: number, asistio: boolean, justificacion?: string): Promise<Asistencias> {
        const asistencia = await this.entrenamientoRepository.actualizarAsistencia(
            id_entrenamiento,
            id_usuario,
            asistio,
            justificacion
        );

        if (!asistencia) {
            console.log("❌ No se pudo actualizar la asistencia");
            throw { message: "No se pudo actualizar la asistencia" };
        }
        return asistencia;
    }

    async getAsistenciasEntrenamiento(id_entrenamiento: number): Promise<Asistencias[]> {
        const asistencias = await this.entrenamientoRepository.getAsistenciasEntrenamiento(id_entrenamiento);
        if (!asistencias || asistencias.length === 0) {
            console.log("❌ No hay asistencias confirmadas para este entrenamiento");
            throw { message: "No hay asistencias confirmadas para este entrenamiento" };
        }
        return asistencias;
    }

    async getAsistenciasJugador(id_usuario: number): Promise<Asistencias[]> {
        const asistencias = await this.entrenamientoRepository.getAsistenciasJugador(id_usuario);
        return asistencias;
    }
}