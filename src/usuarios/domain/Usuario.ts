export default interface Usuario {
    id_usuario: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    rol: 'administrador' | 'entrenador' | 'jugador' | "arbitro";
    telefono?: string;
    activo: boolean;
}