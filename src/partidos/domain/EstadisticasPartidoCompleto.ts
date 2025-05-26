import Partido from "./Partido";
import Entrenador from "../../usuarios/domain/Entrenador";
import AlineacionPartido from "./AlineacionPartido";
import EstadisticasJugador from "./EstadisticasJugador";

export default interface EstadisticasPartidoCompleto {
  partido: Partido;
  alineacionesLocal: AlineacionPartido[];
  alineacionesVisitante: AlineacionPartido[];
  estadisticas: EstadisticasJugador[];
  entrenadoresLocal: Entrenador[];
  entrenadoresVisitante: Entrenador[];
}