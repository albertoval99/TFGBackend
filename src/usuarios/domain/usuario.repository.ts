import Usuario from "./Usuario";
import Entrenador from './Entrenador';

export default interface UsuarioRepository{
    getUserByEmail(email: string): Promise<Usuario|null>;
    registrarUsuario(usuario:Usuario):Promise<Usuario>;
    registrarEntrenador(entrenador:Entrenador):Promise<Entrenador>;
}