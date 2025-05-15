
import Partido from "./Partido";
import { AlineacionPartido } from './AlineacionPartido';
import { EstadisticasJugador } from "./EstadisticasJugador";

export interface EstadisticasPartidoCompleto {
    partido: Partido;
    alineacionesLocal: AlineacionPartido[];
    alineacionesVisitante: AlineacionPartido[];
    estadisticas: EstadisticasJugador[];
  }