export default interface ClasificacionEquipo{
    id_equipo: number;
    nombre: string;
    escudo: string;
    partidos_jugados: number;
    puntos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
}