import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/usuario.repository";
import { executeQuery } from '../../../context/db/postgres.db';
import Entrenador from "../../domain/Entrenador";
import Arbitro from "../../domain/Arbitro";
import Jugador from "../../domain/Jugador";
import Administrador from "../../domain/Adminisitrador";

export default class UsuarioRepositoryPostgres implements UsuarioRepository {

    async getUserByEmail(email: string): Promise<Usuario | null> {

        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [email];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Usuario no encontrado con el email:", email);
            return null;
        }

        return rows[0];
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

    async registrarArbitro(arbitro: Arbitro): Promise<Arbitro> {
        const query = `
            INSERT INTO arbitros (id_usuario)
            VALUES ($1)
            RETURNING *
        `;
        const values = [arbitro.id_usuario];

        const rows = await executeQuery(query, values);

        return rows[0];
    }

    async registrarJugador(jugador: Jugador): Promise<Jugador> {
        const query = `
            INSERT INTO jugadores (id_usuario, id_equipo, posicion, numero_camiseta, activo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [jugador.id_usuario, jugador.id_equipo, jugador.posicion, jugador.numero_camiseta, jugador.activo];

        const rows = await executeQuery(query, values);

        return rows[0];
    }

    async loginAdministrador(administrador: Administrador): Promise<Administrador> {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [administrador.email];

        const result = await executeQuery(query, values);

        if (result.length === 0) throw new Error("Administrador no encontrado")

        return result[0];
    }

   
    async eliminarUsuario(id_usuario: number): Promise<void> {
        const query = 'DELETE FROM usuarios WHERE id_usuario = $1';
        const values = [id_usuario];
        await executeQuery(query, values);
    }

}