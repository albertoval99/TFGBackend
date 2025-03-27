import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";//npm install jsonwebtoken
import UsuarioUseCases from "../../usuarios/application/usuario.usecases";
import UsuarioRepositoryPostgres from "../../usuarios/infrastructure/db/usuario.repository.postgres";
import Usuario from "../../usuarios/domain/Usuario";

const SECRET_KEY: Secret = "malladetaFootballZoneSecretKey";

const usuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryPostgres());


const createToken = (usuario: Usuario): string => {
    const payload = {
        user: {
            alias: usuario.email,
            rol: usuario.rol,
        },
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};


const esAutorizado = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token: string | undefined = authHeader && authHeader.split(" ")[1];
        if (token) {
            const decoded: any = jwt.verify(token, SECRET_KEY);
            req.body.user = decoded.user;
            next();
        } else {
            throw new Error("Token no proporcionado");
        }
    } catch (err) {
        console.error("❌ Error en autenticación:", err.message);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};


const esAdministrador = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body.user;

        const user = await usuarioUseCases.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.rol === "administrador") {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado. Solo administradores." });
        }
    } catch (err) {
        console.error("❌ Error en autorización de administrador:", err.message);
        res.status(401).json({ message: "Error de autorización" });
    }
};


const esEntrenador = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body.user;

        const user = await usuarioUseCases.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.rol === "entrenador") {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado. Solo entrenadores." });
        }
    } catch (err) {
        console.error("❌ Error en autorización de entrenador:", err.message);
        res.status(401).json({ message: "Error de autorización" });
    }
};


const esJugador = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body.user;

        const user = await usuarioUseCases.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.rol === "jugador") {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado. Solo jugadores." });
        }
    } catch (err) {
        console.error("❌ Error en autorización de jugador:", err.message);
        res.status(401).json({ message: "Error de autorización" });
    }
};

const esArbitro = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body.user;

        const user = await usuarioUseCases.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.rol === "arbitro") {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado. Solo árbitros." });
        }
    } catch (err) {
        console.error("❌ Error en autorización de árbitro:", err.message);
        res.status(401).json({ message: "Error de autorización" });
    }
};
const decode = (token: string) => {
    return jwt.decode(token);
};

export { createToken, esAutorizado, esAdministrador, esEntrenador, esJugador, esArbitro, decode };