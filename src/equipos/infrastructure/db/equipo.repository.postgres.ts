import Equipo from '../../domain/Equipo';
import EquipoRepository from '../../domain/equipo.repository';
import { executeQuery } from '../../../context/db/postgres.db';
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
}