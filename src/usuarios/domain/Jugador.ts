export default interface Jugador {
    id_jugador?: number;
    id_usuario?: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    foto?: string;
    id_equipo?: number;
    posicion: string;
    numero_camiseta: number;
    activo: boolean;
}