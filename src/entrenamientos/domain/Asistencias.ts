export default interface Asistencias {
    id_asistencia?: number;
    id_entrenamiento: number;
    id_jugador: number;
    asistio: boolean | null; // null = pendiente
    justificacion?: string;
}