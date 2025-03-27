import Usuario from "../domain/Usuario";
import UsuarioRepository from "../domain/usuario.repository";

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

}