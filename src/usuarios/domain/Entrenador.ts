
export default interface Entrenador {
    id_entrenador?: number;
    id_usuario?: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    foto?: string;
    id_equipo: number;
}