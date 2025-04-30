export default interface Partido{
    id_partido: number;
    fecha_partido: Date;
    hora_partido: string;
    equipo_local_id: number;
    equipo_visitante_id: number;
    goles_local: number;
    goles_visitante: number;
    id_estadio: number;
    id_arbitro: number;
    id_liga: number;
    jornada: number;
    equipo_local?: string;       
    equipo_visitante?: string;    
    estadio?: string;             
    estadio_ubicacion?: string;  
    arbitro_nombre?: string;      
    arbitro_apellidos?: string;
}