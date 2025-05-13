import LigaRepository from "../../ligas/domain/liga.repository";
import Equipo from "../domain/Equipo";
import EquipoRepository from "../domain/equipo.repository";
import Estadio from "../domain/Estadio";

export default class EquipoUseCases {
    private equipoRepository: EquipoRepository;
    private ligaRepository: LigaRepository;

    constructor(equipoRepository: EquipoRepository, ligaRepository: LigaRepository) {
        this.equipoRepository = equipoRepository;
        this.ligaRepository = ligaRepository;
    }

    async getEquipos(): Promise<Equipo[]> {
        const equipos = await this.equipoRepository.getEquipos();
        if (equipos && equipos.length > 0) {
            return equipos;
        } else {
            throw { message: "No se encontraron equipos" };
        }
    }

    async getAllEstadios(): Promise<Estadio[]> {
        const estadios = await this.equipoRepository.getAllEstadios();
        if (estadios && estadios.length > 0) {
            return estadios;
        } else {
            throw { message: "No se encontraron estadios" };
        }
    }
    async getEquipoById(id_equipo: number): Promise<Equipo | null> {
        const equipo = await this.equipoRepository.getEquipoById(id_equipo);
        if (!equipo) {
            console.log(`❌No se encontró el equipo con id: ${id_equipo}`);
            throw new Error("Equipo no encontrado");
        }
        return equipo;
    }

    async registroEquipo(equipo: Equipo): Promise<Equipo> {
        if (!equipo.nombre_equipo) {
            console.log("❌ Falta el nombre del equipo");
            throw { message: "Falta el nombre del equipo" };
        }
        if (!equipo.id_liga) {
            console.log("❌ Falta la liga del equipo");
            throw { message: "Falta la liga del equipo" };
        }
        if (!equipo.escudo) {
            console.log("❌ Falta la ruta del escudo");
            throw { message: "Escribe la ruta de la imagen de tu S3" };
        }

        const liga = await this.ligaRepository.getLigaById(equipo.id_liga);
        if (!liga) {
            console.log("❌ La liga no existe");
            throw { message: "La liga seleccionada no existe" };
        }

        const equipoExistente = await this.equipoRepository.getEquipoByNombre(equipo.nombre_equipo, equipo.id_liga);
        if (equipoExistente) {
            console.log("❌ Ya existe un equipo con ese nombre en la misma liga");
            throw { message: "Ya existe un equipo con ese nombre en la misma liga" };
        }

        const equipoRegistrado = await this.equipoRepository.registrarEquipo(equipo);

        return equipoRegistrado;
    }
}