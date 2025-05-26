export default interface EstadisticasJugador {
  id_jugador: number;
  nombre: string;
  apellidos: string;
  dorsal: number;
  goles: number;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
  mejor_jugador: boolean;
  titularidades?: number;
}
    
  