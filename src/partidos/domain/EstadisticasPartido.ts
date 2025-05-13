export default interface EstadisticasPartido {
    id_estadistica: number;
    id_jugador: number;
    id_partido: number;
    goles: number;
    tarjetas_amarillas: number;
    tarjetas_rojas: number;
    mejor_jugador: boolean;
    titularidades: number;
  }