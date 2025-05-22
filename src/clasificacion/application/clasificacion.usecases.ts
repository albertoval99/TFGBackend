import ClasificacionRepository from "../domain/clasificacion.repository";
import ClasificacionEquipo from "../domain/ClasificacionEquipo";

import EquipoRepository from '../../equipos/domain/equipo.repository';

export default class ClasificacionUseCase {
    private clasificacionRepository: ClasificacionRepository;
    private equipoRepository:EquipoRepository

    constructor(clasificacionRepository: ClasificacionRepository, equipoRepository:EquipoRepository) {
        this.clasificacionRepository = clasificacionRepository;
        this.equipoRepository = equipoRepository
    }

    async obtenerClasificacion(id_liga: number): Promise<ClasificacionEquipo[]> {
        // Obtenemos métricas básicas
        const partidosJugados = await this.clasificacionRepository.getPartidosJugadosPorEquipo(id_liga);
        const victorias = await this.clasificacionRepository.getVictoriasPorEquipo(id_liga);
        const empates = await this.clasificacionRepository.getEmpatesPorEquipo(id_liga);
        const golesFavor = await this.clasificacionRepository.getGolesFavorPorEquipo(id_liga);
        const golesContra = await this.clasificacionRepository.getGolesContraPorEquipo(id_liga);

        const clasificacionMap = new Map<number, ClasificacionEquipo>();

        // Inicializamos el mapa con partidos jugados y cargamos nombre/escudo
        for (const pj of partidosJugados) {
            const base: ClasificacionEquipo = {
                id_equipo: pj.id_equipo,
                nombre: "",
                escudo: "",
                partidos_jugados: pj.jugados,
                puntos: 0,
                goles_favor: 0,
                goles_contra: 0,
                diferencia_goles: 0,
            };

            // Rellenar nombre y escudo desde la tabla de equipos
            const equipoInfo = await this.equipoRepository.getEquipoById(pj.id_equipo);
            if (equipoInfo) {
                base.nombre = equipoInfo.nombre_equipo;
                base.escudo = equipoInfo.escudo;
            }

            clasificacionMap.set(pj.id_equipo, base);
        }

        // Sumamos victorias (3 puntos cada una)
        for (const v of victorias) {
            const equipo = clasificacionMap.get(v.id_equipo);
            if (equipo) equipo.puntos += v.victorias * 3;
        }

        // Sumamos empates (1 punto cada uno)
        for (const e of empates) {
            const equipo = clasificacionMap.get(e.id_equipo);
            if (equipo) equipo.puntos += e.empates;
        }

        // Asignamos goles a favor
        for (const gf of golesFavor) {
            const equipo = clasificacionMap.get(gf.id_equipo);
            if (equipo) equipo.goles_favor = gf.goles_favor;
        }

        // Asignamos goles en contra
        for (const gc of golesContra) {
            const equipo = clasificacionMap.get(gc.id_equipo);
            if (equipo) equipo.goles_contra = gc.goles_contra;
        }

        // Calculamos diferencia de goles
        for (const equipo of clasificacionMap.values()) {
            equipo.diferencia_goles = equipo.goles_favor - equipo.goles_contra;
        }

        // Convertimos a array y ordenamos
        const clasificacion = Array.from(clasificacionMap.values());
        clasificacion.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            if (b.diferencia_goles !== a.diferencia_goles)
                return b.diferencia_goles - a.diferencia_goles;
            return b.goles_favor - a.goles_favor;
        });

        return clasificacion;
    }
}
