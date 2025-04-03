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
}