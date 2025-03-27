import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/usuario.repository";
import { executeQuery } from '../../../context/db/postgres.db';
import Entrenador from "../../domain/Entrenador";

export default class UsuarioRepositoryPostgres implements UsuarioRepository {

    async getUserByEmail(email: string): Promise<Usuario | null> {

        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [email];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Usuario no encontrado con el email:", email);
            return null;
        }

        return {
            id_usuario: rows[0].id_usuario,
            nombre: rows[0].nombre,
            apellidos: rows[0].apellidos,
            email: rows[0].email,
            password: rows[0].password,
            rol: rows[0].rol,
            telefono: rows[0].telefono,
            foto: rows[0].foto
        }
    }

    async registrarUsuario(usuario: Usuario): Promise<Usuario> {
        const query = `
            INSERT INTO usuarios (nombre, apellidos, email, password, rol, telefono, foto)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [
            usuario.nombre,
            usuario.apellidos,
            usuario.email,
            usuario.password,
            usuario.rol,
            usuario.telefono,
            usuario.foto
        ];

        const rows = await executeQuery(query, values);


        return rows[0];
    }

    async registrarEntrenador(entrenador: Entrenador): Promise<Entrenador> {
        const query = `
            INSERT INTO entrenadores (id_usuario, id_equipo)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [entrenador.id_usuario, entrenador.id_equipo];

        const rows = await executeQuery(query, values);

        return rows[0];
        
    }
}