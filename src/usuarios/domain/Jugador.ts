

export default interface Jugador {
    id_jugador?: number;
    id_usuario: number;
    id_equipo?: number; 
    posicion: string;
    numero_camiseta: number;
    activo: boolean;
}