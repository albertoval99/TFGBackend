export default interface AlineacionPartido {
    id_jugador: number;
    id_partido: number;
    id_equipo: number;
    nombre: string;
    apellidos: string;
    numero_camiseta: number;
    posicion: string;
    es_titular: boolean;
}