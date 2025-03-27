import { executeQuery } from "../../context/db/postgres.db";
import Usuario from "../domain/Usuario";
import UsuarioRepository from "../domain/usuario.repository";
import { compare, hash } from "../../context/security/encrypter";
import Entrenador from "../domain/Entrenador";

export default class UsuarioUseCases {
    private usuarioRepository: UsuarioRepository;

    constructor(usuarioRepository: UsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async getUserByEmail(email: string): Promise<Usuario> {
        const user = await this.usuarioRepository.getUserByEmail(email);
        if (!user) {
            console.log(`❌No se encontró el usuario con email: ${email}`);
            throw new Error("Usuario no encontrado");
        }
        console.log("✅ Usuario encontrado:", user);
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
        // Validate required fields
        if (!entrenador.nombre) throw { message: "Falta el nombre del entrenador" };
        if (!entrenador.apellidos) throw { message: "Faltan los apellidos del entrenador" };
        if (!entrenador.email) throw { message: "Falta el email del entrenador" };
        if (!entrenador.password) throw { message: "Falta la contraseña del entrenador" };
    
        // Check if the email is already registered
        const usuarioExistente = await this.usuarioRepository.getUserByEmail(entrenador.email);
        if (usuarioExistente) {
            console.log("❌ El email ya está registrado");
            throw { message: "El email ya está registrado" };
        }
    
        // Encrypt the password
        const cifrada = hash(entrenador.password);
        entrenador.password = cifrada;
    
        // Register the user
        const usuarioRegistrado = await this.usuarioRepository.registrarUsuario({
            nombre: entrenador.nombre,
            apellidos: entrenador.apellidos,
            email: entrenador.email,
            password: entrenador.password,
            rol: "entrenador",
            telefono: entrenador.telefono,
            foto: entrenador.foto
        });
    
        // Register the coach
        const entrenadorRegistrado = await this.usuarioRepository.registrarEntrenador({
            id_usuario: usuarioRegistrado.id_usuario,
            id_entrenador:entrenador.id_entrenador,
            id_equipo: entrenador.id_equipo,
            nombre: entrenador.nombre,
            apellidos: entrenador.apellidos,
            email: entrenador.email,
            password: entrenador.password,
        });
    
        // Combine user and coach data
        return {
            ...usuarioRegistrado,
            ...entrenadorRegistrado
        };
    }
}