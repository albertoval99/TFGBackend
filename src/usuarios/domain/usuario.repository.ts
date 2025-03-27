import Usuario from "./Usuario";

export default interface UsuarioRepository{
    getUserByEmail(email: string): Promise<Usuario>;
}