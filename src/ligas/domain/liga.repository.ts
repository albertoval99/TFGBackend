import Liga from './Liga';
export default interface LigaRepository{
    registrarLiga(liga:Liga):Promise<Liga>;
    getLigaById(id_liga: number): Promise<Liga | null>;
    getLigas():Promise<Liga[]>;
}