export default interface Jugador {
    id_jugador: number;
    nombre_jugador: string;
    id_equipo: number | null; // Relación con la clase Equipo
    posicion: string;
    numero_camiseta?: number;
    foto?: string;
}