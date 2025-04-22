import Liga from './Liga';
export default interface LigaRepository{
    registrarLiga(liga:Liga):Promise<Liga>;
}