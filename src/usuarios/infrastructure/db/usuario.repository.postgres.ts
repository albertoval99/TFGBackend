import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/usuario.repository";
import { executeQuery } from '../../../context/db/postgres.db';

export default class UsuarioRepositoryPostgres implements UsuarioRepository {

    async getUserByEmail(email: string): Promise<Usuario> {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [email];

        const result = await executeQuery(query, values);

        return result[0];
    }
}