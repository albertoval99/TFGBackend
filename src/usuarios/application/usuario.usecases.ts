import { executeQuery } from "../../context/db/postgres.db";
import Usuario from "../domain/Usuario";
import UsuarioRepository from "../domain/usuario.repository";
import { compare, hash } from "../../context/security/encrypter";
import Entrenador from "../domain/Entrenador";
import Arbitro from "../domain/Arbitro";
import Jugador from "../domain/Jugador";
import Administrador from "../domain/Adminisitrador";
import EquipoRepository from "../../equipos/domain/equipo.repository";

export default class UsuarioUseCases {
    private usuarioRepository: UsuarioRepository;

    constructor(usuarioRepository: UsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async getUserByEmail(email: string): Promise<Usuario> {
        const user = await this.usuarioRepository.getUserByEmail(email);
        if (!user) {
            console.log(`❌No se encontró el usuario con email: ${email}`);
            throw { message: "Usuario no encontrado" };
        }
        return user;
    }

    async getEntrenadorById(id_usuario: number): Promise<Usuario | null> {
        const user = await this.usuarioRepository.getEntrenadorById(id_usuario);
        if (!user) {
            console.log(`❌No se encontró el entrenador con id: ${id_usuario}`);
            throw { message:"Entrenador no encontrado" };
        }
        return user;
    }

    async getJugadorCompletoById(id_usuario: number): Promise<Usuario | null> {
        const user = await this.usuarioRepository.getJugadorCompletoById(id_usuario);
        if (!user) {
            console.log(`❌ No se encontró el jugador con id: ${id_usuario}`);
            throw { message: "Jugador no encontrado" };
        }
        return user;
    }

    async getArbitroCompletoById(id_usuario: number): Promise<Usuario | null> {
        const user = await this.usuarioRepository.getArbitroCompletoById(id_usuario);
        if (!user) {
            console.log(`❌ No se encontró el arbitro con id: ${id_usuario}`);
            throw { message: "Arbitro no encontrado" };
        }
        return user;
    }

    async registroUsuario(usuario: Usuario): Promise<Usuario> {
        if (!usuario.nombre) {
            console.log("❌ Falta el nombre del usuario");
            throw { message: "Falta el nombre del usuario" };
        }
        if (!usuario.apellidos) {
            console.log("❌ Faltan los apellidos del usuario");
            throw { message: "Faltan los apellidos del usuario" };
        }
        if (!usuario.email) {
            console.log("❌ Falta el email del usuario");
            throw { message: "Falta el email del usuario" };
        }
        if (!usuario.password) {
            console.log("❌ Falta la contraseña del usuario");
            throw { message: "Falta la contraseña del usuario" };
        }

        const usuarioExistente = await this.usuarioRepository.getUserByEmail(usuario.email);
        if (usuarioExistente) {
            console.log("❌ El email ya está registrado");
            throw { message: "El email ya está registrado" };
        }
        const cifrada = hash(usuario.password);
        usuario.password = cifrada;
        const usuarioRegistrado = await this.usuarioRepository.registrarUsuario(usuario);
        return usuarioRegistrado;
    }

    async registrarEntrenador(entrenador: Entrenador): Promise<Entrenador> {
        if (!entrenador.nombre) {
            console.log("❌ Falta el nombre del entrenador");
            throw { message: "Falta el nombre del entrenador" };
        }
        if (!entrenador.apellidos) {
            console.log("❌ Faltan los apellidos del entrenador");
            throw { message: "Faltan los apellidos del entrenador" };
        }
        if (!entrenador.email) {
            console.log("❌ Falta el email del entrenador");
            throw { message: "Falta el email del entrenador" };
        }
        if (!entrenador.password) {
            console.log("❌ Falta la contraseña del entrenador");
            throw { message: "Falta la contraseña del entrenador" };
        }
        const usuarioExistente = await this.usuarioRepository.getUserByEmail(entrenador.email);
        if (usuarioExistente) {
            console.log("❌ El email ya está registrado");
            throw { message: "El email ya está registrado" };
        }
        const cifrada = hash(entrenador.password);
        entrenador.password = cifrada;
        try {
            const usuarioRegistrado = await this.usuarioRepository.registrarUsuario({
                nombre: entrenador.nombre,
                apellidos: entrenador.apellidos,
                email: entrenador.email,
                password: entrenador.password,
                rol: "entrenador",
                telefono: entrenador.telefono
            });

            try {
                const entrenadorRegistrado = await this.usuarioRepository.registrarEntrenador({
                    id_usuario: usuarioRegistrado.id_usuario,
                    id_entrenador: entrenador.id_entrenador,
                    id_equipo: entrenador.id_equipo,
                    nombre: entrenador.nombre,
                    apellidos: entrenador.apellidos,
                    email: entrenador.email,
                    password: entrenador.password,
                    telefono: entrenador.telefono,
                    foto: entrenador.foto
                });

                return {
                    ...usuarioRegistrado,
                    ...entrenadorRegistrado
                };
            } catch (error) {
                // Si falla el registro en la tabla entrenadores, elimino el usuario
                await this.usuarioRepository.eliminarUsuario(usuarioRegistrado.id_usuario);
                console.log("❌ Error al registrar en la tabla entrenadores");
                throw { message: "Error al registrar el entrenador" };
            }
        } catch (error) {
            console.log("❌ Error al registrar el usuario");
            throw { message: "Error al registrar el entrenador" };
        }
    }

    async registrarArbitro(arbitro: Arbitro): Promise<Arbitro> {
        if (!arbitro.nombre) {
            console.log("❌ Falta el nombre del árbitro");
            throw { message: "Falta el nombre del árbitro" };
        }
        if (!arbitro.apellidos) {
            console.log("❌ Faltan los apellidos del árbitro");
            throw { message: "Faltan los apellidos del árbitro" };
        }
        if (!arbitro.email) {
            console.log("❌ Falta el email del árbitro");
            throw { message: "Falta el email del árbitro" };
        }
        if (!arbitro.password) {
            console.log("❌ Falta la contraseña del árbitro");
            throw { message: "Falta la contraseña del árbitro" };
        }
        const usuarioExistente = await this.usuarioRepository.getUserByEmail(arbitro.email);
        if (usuarioExistente) {
            console.log("❌ El email ya está registrado");
            throw { message: "El email ya está registrado" };
        }
        const cifrada = hash(arbitro.password);
        arbitro.password = cifrada;
        try {
            const usuarioRegistrado = await this.usuarioRepository.registrarUsuario({
                nombre: arbitro.nombre,
                apellidos: arbitro.apellidos,
                email: arbitro.email,
                password: arbitro.password,
                rol: "arbitro",
                telefono: arbitro.telefono
            });
            try {
                const arbitroRegistrado = await this.usuarioRepository.registrarArbitro({
                    id_usuario: usuarioRegistrado.id_usuario,
                    id_arbitro: arbitro.id_arbitro,
                    nombre: arbitro.nombre,
                    apellidos: arbitro.apellidos,
                    email: arbitro.email,
                    password: arbitro.password,
                    telefono: arbitro.telefono,
                    foto: arbitro.foto
                });
                return {
                    ...usuarioRegistrado,
                    ...arbitroRegistrado
                };
            } catch (error) {
                // Si falla el registro en la tabla entrenadores, elimino el usuario
                await this.usuarioRepository.eliminarUsuario(usuarioRegistrado.id_usuario);
                console.log("❌ Error al registrar en la tabla arbitros");
                throw { message: "Error al registrar el árbitro" };
            }
        } catch (error) {
            console.log("❌ Error al registrar el usuario");
            throw { message: "Error al registrar el árbitro" };
        }
    }
    async registrarJugador(jugador: Jugador): Promise<Jugador> {
        if (!jugador.nombre) {
            console.log("❌ Falta el nombre del jugador");
            throw { message: "Falta el nombre del jugador" };
        }
        if (!jugador.apellidos) {
            console.log("❌ Faltan los apellidos del jugador");
            throw { message: "Faltan los apellidos del jugador" };
        }
        if (!jugador.email) {
            console.log("❌ Falta el email del jugador");
            throw { message: "Falta el email del jugador" };
        }
        if (!jugador.password) {
            console.log("❌ Falta la contraseña del jugador");
            throw { message: "Falta la contraseña del jugador" };
        }
        if (!jugador.posicion) {
            console.log("❌ Falta la posición del jugador");
            throw { message: "Falta la posición del jugador" };
        }
        if (!jugador.numero_camiseta) {
            console.log("❌ Falta el número de camiseta del jugador");
            throw { message: "Falta el número de camiseta del jugador" };
        }
        const usuarioExistente = await this.usuarioRepository.getUserByEmail(jugador.email);
        if (usuarioExistente) {
            console.log("❌ El email ya está registrado");
            throw { message: "El email ya está registrado" };
        }
        const query = `
        SELECT * FROM jugadores 
        WHERE id_equipo = $1 AND numero_camiseta = $2 AND activo = true
    `;
        const values = [jugador.id_equipo, jugador.numero_camiseta];
        const result = await executeQuery(query, values);
        if (result.length > 0) {
            console.log("❌ El número de camiseta ya está en uso en este equipo");
            throw { message: "El número de camiseta ya está en uso en este equipo" };
        }
        const cifrada = hash(jugador.password);
        jugador.password = cifrada;
        try {
            const usuarioRegistrado = await this.usuarioRepository.registrarUsuario({
                nombre: jugador.nombre,
                apellidos: jugador.apellidos,
                email: jugador.email,
                password: jugador.password,
                rol: "jugador",
                telefono: jugador.telefono
            });
            try {
                const jugadorRegistrado = await this.usuarioRepository.registrarJugador({
                    id_usuario: usuarioRegistrado.id_usuario,
                    id_jugador: jugador.id_jugador,
                    id_equipo: jugador.id_equipo,
                    nombre: jugador.nombre,
                    apellidos: jugador.apellidos,
                    email: jugador.email,
                    password: jugador.password,
                    telefono: jugador.telefono,
                    foto: jugador.foto,
                    posicion: jugador.posicion,
                    numero_camiseta: jugador.numero_camiseta,
                    activo: jugador.activo
                });
                return {
                    ...usuarioRegistrado,
                    ...jugadorRegistrado
                };
            } catch (error) {
                // Si falla el registro en la tabla entrenadores, elimino el usuario
                await this.usuarioRepository.eliminarUsuario(usuarioRegistrado.id_usuario);
                console.log("❌ Error al registrar en la tabla jugadores");
                throw { message: `Error al registrar el jugador: ${error}` };
            }
        } catch (error) {
            console.log("❌ Error al registrar el usuario");
            throw { message: "Error al registrar el jugador" };
        }
    }

    async loginAdministrador(administrador: Administrador): Promise<Administrador> {
        if (!administrador.email) {
            console.log("❌ Falta el email del administrador");
            throw { message: "Falta el email del administrador" };
        }
        if (!administrador.password) {
            console.log("❌ Falta la contraseña del administrador");
            throw { message: "Falta la contraseña del administrador" };
        }
        const adminEncontrado = await this.usuarioRepository.loginAdministrador(administrador);
        if (!adminEncontrado) {
            console.log("❌ El email es incorrecto");
            throw { message: "El email es incorrecto" };
        }
        const passwordValida = compare(administrador.password, adminEncontrado.password);
        if (!passwordValida) {
            console.log("❌ Contraseña incorrecta");
            throw { message: "Contraseña incorrecta" };
        }
        return adminEncontrado;
    }

    async loginEntrenador(entrenador: Entrenador): Promise<Entrenador> {
        if (!entrenador.email) {
            console.log("❌ Falta el email del entrenador");
            throw { message: "Falta el email del entrenador" };
        }
        if (!entrenador.password) {
            console.log("❌ Falta la contraseña del entrenador");
            throw { message: "Falta la contraseña del entrenador" };
        }
        const entrenadorEncontrado = await this.usuarioRepository.loginEntrenador(entrenador);
        if (!entrenadorEncontrado) {
            console.log("❌ El email es incorrecto");
            throw { message: "El email es incorrecto" };
        }
        const passwordValida = compare(entrenador.password, entrenadorEncontrado.password);
        if (!passwordValida) {
            console.log("❌ Contraseña incorrecta");
            throw { message: "Contraseña incorrecta" };
        }
        return entrenadorEncontrado;
    }

    async loginArbitro(arbitro: Arbitro): Promise<Arbitro> {
        if (!arbitro.email) {
            console.log("❌ Falta el email del árbitro");
            throw { message: "Falta el email del árbitro" };
        }
        if (!arbitro.password) {
            console.log("❌ Falta la contraseña del árbitro");
            throw { message: "Falta la contraseña del árbitro" };
        }
        const arbitroEncontrado = await this.usuarioRepository.loginArbitro(arbitro);
        if (!arbitroEncontrado) {
            console.log("❌ El email es incorrecto");
            throw { message: "El email es incorrecto" };
        }
        const passwordValida = compare(arbitro.password, arbitroEncontrado.password);

        if (!passwordValida) {
            console.log("❌ Contraseña incorrecta");
            throw { message: "Contraseña incorrecta" };
        }

        return arbitroEncontrado;
    }

    async loginJugador(jugador: Jugador): Promise<Jugador> {
        if (!jugador.email) {
            console.log("❌ Falta el email del jugador");
            throw { message: "Falta el email del jugador" };
        }
        if (!jugador.password) {
            console.log("❌ Falta la contraseña del jugador");
            throw { message: "Falta la contraseña del jugador" };
        }
        const jugadorEncontrado = await this.usuarioRepository.loginJugador(jugador);
        if (!jugadorEncontrado) {
            console.log("❌ El email es incorrecto");
            throw { message: "El email es incorrecto" };
        }
        const passwordValida = compare(jugador.password, jugadorEncontrado.password);
        if (!passwordValida) {
            console.log("❌ Contraseña incorrecta");
            throw { message: "Contraseña incorrecta" };
        }
        return jugadorEncontrado;
    }


    async getAllUsuarios(): Promise<Usuario[]> {
        const usuarios = await this.usuarioRepository.getAllUsuarios();
        if (usuarios && usuarios.length > 0) {
            return usuarios;
        } else {
            console.log("❌ No se encontraron usuarios");
            throw { message: "No se encontraron usuarios" };
        }
    }

    async getJugadoresByEquipo(id_equipo: number): Promise<Jugador[]> {
        const jugadores = await this.usuarioRepository.getJugadoresByEquipo(id_equipo);
        if (!jugadores || jugadores.length === 0) {
            console.log(`❌ No se encontraron jugadores para el equipo con id: ${id_equipo}`);
            throw { message: "No se encontraron jugadores para este equipo" };
        }
        return jugadores;
    }

    async eliminarUsuario(id_usuario: number): Promise<void> {
        try {
            const usuario = await this.usuarioRepository.getJugadorCompletoById(id_usuario);
            if (!usuario) {
                console.log("❌ Usuario no encontrado:", id_usuario);
                throw { message: "Usuario no encontrado" };
            }
            await this.usuarioRepository.eliminarUsuario(id_usuario);
        } catch (error) {
            console.error("❌ Error al eliminar usuario:", error);
            throw { message: "Error al eliminar usuario" };
        }
    }

    async editarJugador(id_jugador: number, posicion?: string, numero_camiseta?: number, activo?: boolean): Promise<void> {
        try {
            if (numero_camiseta !== undefined) {
                if (numero_camiseta < 1 || numero_camiseta > 99) {
                    console.log("❌ Número de camiseta no válido:", numero_camiseta);
                    throw { message: "El número de camiseta debe estar entre 1 y 99" };
                }
                const query = `
                    SELECT * FROM jugadores 
                    WHERE id_equipo = (SELECT id_equipo FROM jugadores WHERE id_jugador = $1)
                    AND numero_camiseta = $2 
                    AND id_jugador != $1
                `;
                const values = [id_jugador, numero_camiseta];
                const result = await executeQuery(query, values);
                if (result.length > 0) {
                    console.log("❌ El número de camiseta ya está en uso en este equipo");
                    throw { message: "El número de camiseta ya está en uso en este equipo" };
                }
            }
            await this.usuarioRepository.editarJugador(id_jugador, posicion, numero_camiseta, activo);
        } catch (error) {
            console.error("❌ Error al editar jugador:", error);
            throw { message: "Error al editar el jugador" };
        }
    }

    async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
        if (!usuario.id_usuario) {
            throw { message: "El id_usuario es obligatorio para actualizar" };
        }
        if ((usuario.email === undefined || usuario.email === "") && (usuario.telefono === undefined || usuario.telefono === "")) {
            throw { message: "Debe enviar al menos email o teléfono para actualizar" };
        }
        const usuarioActualizado = await this.usuarioRepository.actualizarUsuario(usuario);
        return usuarioActualizado;
    }
}