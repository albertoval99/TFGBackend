import Asistencias from "./Asistencias";
import Entrenamiento from "./Entrenamiento";

export default interface EntrenamientoRepository{
    crearEntrenamiento(entrenamiento: Entrenamiento): Promise<Entrenamiento>;
    eliminarEntrenamiento(id_entrenamiento: number, id_equipo: number): Promise<boolean>;
    getEntrenamientosEquipo(id_equipo: number): Promise<Entrenamiento[]>;
    crearAsistenciasJugadores(id_entrenamiento: number, id_equipo: number): Promise<void>;
    actualizarAsistencia(id_entrenamiento: number, id_jugador: number, asistio: boolean, justificacion?: string): Promise<Asistencias>;
    getAsistenciasEntrenamiento(id_entrenamiento: number): Promise<Asistencias[]>;
    getAsistenciasJugador(id_usuario: number): Promise<Asistencias[]>;
}