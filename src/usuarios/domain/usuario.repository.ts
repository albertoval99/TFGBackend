import Usuario from "./Usuario";
import Entrenador from './Entrenador';
import Arbitro from './Arbitro';
import Jugador from './Jugador';
import Administrador from './Adminisitrador';

export default interface UsuarioRepository{
    getUserByEmail(email: string): Promise<Usuario|null>;
    registrarUsuario(usuario:Usuario):Promise<Usuario>;
    registrarEntrenador(entrenador:Entrenador):Promise<Entrenador>;
    registrarArbitro(arbitro: Arbitro): Promise<Arbitro>;
    registrarJugador(jugador: Jugador): Promise<Jugador>;
    eliminarUsuario(id_usuario: number): Promise<void>;
    loginAdministrador(administrador: Administrador): Promise<Administrador>;
    loginEntrenador(entrenador: Entrenador): Promise<Entrenador>;
    loginArbitro(arbitro: Arbitro): Promise<Arbitro>;
    loginJugador(jugador: Jugador): Promise<Jugador>;
}