import Equipo from '../../domain/Equipo';
import EquipoRepository from '../../domain/equipo.repository';
import { executeQuery } from '../../../context/db/postgres.db';
import Estadio from '../../domain/Estadio';
export default class EquipoRepositoryPostgres implements EquipoRepository {

    async getEquipos(): Promise<Equipo[]> {
        const query = 'SELECT * FROM equipos';
        const result = await executeQuery(query);

        if (result.length === 0) {
            return [];
        }
        return result;
    }

    async getEquipoById(id_equipo: number): Promise<Equipo | null> {
        const query = 'SELECT * FROM equipos WHERE id_equipo = $1';
        const values = [id_equipo];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Equipo no encontrado por el id:", id_equipo);
            return null;
        }

        return rows[0];
    }

    async getEquipoByNombre(nombre_equipo: string, id_liga: number): Promise<Equipo | null> {
        const query = 'SELECT * FROM equipos WHERE nombre_equipo = $1 AND id_liga = $2';
        const values = [nombre_equipo, id_liga];
        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }


    async registrarEquipo(equipo: Equipo): Promise<Equipo> {
        const equipoExistente = await this.getEquipoByNombre(equipo.nombre_equipo, equipo.id_liga);
        if (equipoExistente) {
            throw { message: "Ya existe un equipo con ese nombre en la liga seleccionada" };
        }

        const query = `
        INSERT INTO equipos (nombre_equipo, id_liga, escudo)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
        const values = [
            equipo.nombre_equipo,
            equipo.id_liga,
            equipo.escudo
        ];

        const rows = await executeQuery(query, values);
        return rows[0];
    }

    async getAllEstadios(): Promise<Estadio[]> {
        const query = 'SELECT * FROM Estadios';
        const result = await executeQuery(query);
        return result;
    }
}