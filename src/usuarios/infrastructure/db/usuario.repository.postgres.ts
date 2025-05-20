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
            INSERT INTO usuarios (nombre, apellidos, email, password, rol, telefono)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            usuario.nombre,
            usuario.apellidos,
            usuario.email,
            usuario.password,
            usuario.rol,
            usuario.telefono
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

    async eliminarUsuario(id_usuario: number): Promise<void> {
        const query = 'DELETE FROM usuarios WHERE id_usuario = $1';
        const values = [id_usuario];
        await executeQuery(query, values);
    }

    async loginAdministrador(administrador: Administrador): Promise<Administrador> {
        const query = `
        SELECT a.*, u.nombre, u.apellidos, u.email, u.password, u.telefono, u.rol
        FROM administradores a
        JOIN usuarios u ON a.id_usuario = u.id_usuario
        WHERE u.email = $1 AND u.rol = 'administrador'
    `;
        const values = [administrador.email];

        const result = await executeQuery(query, values);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async loginEntrenador(entrenador: Entrenador): Promise<Entrenador> {
        const query = `
            SELECT e.*, u.nombre, u.apellidos, u.email, u.password, u.telefono, u.rol
            FROM entrenadores e
            JOIN usuarios u ON e.id_usuario = u.id_usuario
            WHERE u.email = $1 AND u.rol = 'entrenador'
        `;
        const values = [entrenador.email];
        const result = await executeQuery(query, values);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async loginArbitro(arbitro: Arbitro): Promise<Arbitro> {
        const query = `
            SELECT a.*, u.nombre, u.apellidos, u.email, u.password, u.telefono, u.rol
            FROM arbitros a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            WHERE u.email = $1 AND u.rol = 'arbitro'
        `;
        const values = [arbitro.email];
        const result = await executeQuery(query, values);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async loginJugador(jugador: Jugador): Promise<Jugador> {
        const query = `
            SELECT j.*, u.nombre, u.apellidos, u.email, u.password, u.telefono, u.rol
            FROM jugadores j
            JOIN usuarios u ON j.id_usuario = u.id_usuario
            WHERE u.email = $1 AND u.rol = 'jugador'
        `;
        const values = [jugador.email];
        const result = await executeQuery(query, values);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async getAllUsuarios(): Promise<Usuario[]> {
        const query = 'SELECT * FROM usuarios';
        const result = await executeQuery(query);

        return result.map((row: any) => ({
            ...row //Devolver todo
        }));
    }
    async getEntrenadorById(id_usuario: number): Promise<Usuario | null> {
        const query = 'SELECT * FROM entrenadores WHERE id_usuario = $1';
        const values = [id_usuario];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Entrenador no encontrado con el ID:", id_usuario);
            return null;
        }

        return rows[0];
    }

    async getJugadorCompletoById(id_usuario: number): Promise<Usuario | null> {
        const query = `
        SELECT u.id_usuario, u.nombre, u.apellidos, u.email, j.posicion, j.numero_camiseta, j.activo, j.id_equipo, j.id_jugador
        FROM Usuarios u
        JOIN Jugadores j ON u.id_usuario = j.id_usuario
        WHERE u.id_usuario = $1;
    `;
        const values = [id_usuario];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Jugador no encontrado con el ID:", id_usuario);
            return null;
        }

        return rows[0];
    }

    async getArbitroCompletoById(id_usuario: number): Promise<Usuario | null> {
        const query = `
        SELECT u.id_usuario, u.nombre, u.apellidos, u.email, a.id_arbitro
        FROM Usuarios u
        JOIN Arbitros a ON u.id_usuario = a.id_usuario
        WHERE u.id_usuario = $1;
    `;
        const values = [id_usuario];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ Arbitro no encontrado con el ID:", id_usuario);
            return null;
        }

        return rows[0];
    }


    async getJugadoresByEquipo(id_equipo: any): Promise<Jugador[]> {
        const query = `
            SELECT 
                u.nombre,
                u.apellidos,
                j.posicion,
                j.numero_camiseta,
                j.activo,
                j.id_usuario,
                j.id_jugador
            FROM Jugadores j
            JOIN Usuarios u ON j.id_usuario = u.id_usuario
            WHERE j.id_equipo = $1
        `;
        const values = [id_equipo];

        const rows = await executeQuery(query, values);

        if (rows.length === 0) {
            console.log("❌ No se encontraron jugadores para el equipo:", id_equipo);
            return [];
        }
        return rows;
    }

    async editarJugador(id_jugador: number, posicion?: string, numero_camiseta?: number, activo?: boolean): Promise<void> {
        try {
            const actualizaciones = [];
            const values = [];
            let parameterIndex = 1;

            if (posicion !== undefined) {
                actualizaciones.push(`posicion = $${parameterIndex}`);
                values.push(posicion);
                parameterIndex++;
            }

            if (numero_camiseta !== undefined) {
                actualizaciones.push(`numero_camiseta = $${parameterIndex}`);
                values.push(numero_camiseta);
                parameterIndex++;
            }

            if (activo !== undefined) {
                actualizaciones.push(`activo = $${parameterIndex}`);
                values.push(activo);
                parameterIndex++;
            }

            if (actualizaciones.length === 0) {
                throw new Error("No se proporcionaron datos para actualizar");
            }

            values.push(id_jugador);

            const query = `
                UPDATE jugadores 
                SET ${actualizaciones.join(', ')} 
                WHERE id_jugador = $${parameterIndex}
            `;

            await executeQuery(query, values);
        } catch (error) {
            console.error("❌ Error en repository al editar jugador:", error);
            throw { message: `Error en repository al editar jugador: ${error}` };
        }
    }


    async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
        let query = "UPDATE usuarios SET ";
        let indiceValor = 1;
        const values = [];
        let camposActualizados = false;

        if (usuario.email !== undefined && usuario.email !== "") {
            query += `email = $${indiceValor}`;
            values.push(usuario.email);
            indiceValor++;
            camposActualizados = true;
        }

        if (usuario.telefono !== undefined && usuario.telefono !== "") {
            if (camposActualizados) {
                query += ", ";
            }
            query += `telefono = $${indiceValor}`;
            values.push(usuario.telefono);
            indiceValor++;
            camposActualizados = true;
        }

        if (!camposActualizados) {
            throw new Error('No hay campos para actualizar');
        }

        query += ` WHERE id_usuario = $${indiceValor}`;
        values.push(usuario.id_usuario);

        query += " RETURNING *";

        const result = await executeQuery(query, values);

        return result[0];
    }


}