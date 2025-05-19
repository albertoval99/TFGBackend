
import Partido from "./Partido";
import { AlineacionPartido } from './AlineacionPartido';
import { EstadisticasJugador } from "./EstadisticasJugador";
import Entrenador from "../../usuarios/domain/Entrenador";

export interface EstadisticasPartidoCompleto {
  partido: Partido;
  alineacionesLocal: AlineacionPartido[];
  alineacionesVisitante: AlineacionPartido[];
  estadisticas: EstadisticasJugador[];
  entrenadoresLocal: Entrenador[];
  entrenadoresVisitante: Entrenador[];
}