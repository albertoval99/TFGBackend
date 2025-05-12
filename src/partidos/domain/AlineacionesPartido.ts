export default interface AlineacionesPartido {
    id_alineacion?: number;
    id_partido: number;
    id_jugador: number;
    id_equipo: number;
    es_titular: boolean;
    nombre: string;
    apellidos: string;
    dorsal: number;
    posicion: string;
}