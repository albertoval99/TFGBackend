import express from "express";
import cors from 'cors';
import usuarioRouter from "./usuarios/infrastructure/rest/usuario.rest"
import equipoRouter from "./equipos/infrastructure/rest/equipo.rest"
import ligaRouter from "./ligas/infrastructure/rest/liga.rest"
import entrenamientosRouter from "./entrenamientos/infrastructure/rest/entrenamiento.rest"
import partidosRouter from "./partidos/infrastructure/rest/partido.rest"
import estadisticasRouter from "./estadisticas/infrastructure/rest/estadisticas.rest"

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../doc/swagger.json");


const cors = require('cors');
const corsOptions = {
   origin: "*"
}
app.use(cors(corsOptions));
app.use(express.json());


const api = "/api";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${api}/usuarios`, usuarioRouter);
app.use(`${api}/equipos`, equipoRouter);
app.use(`${api}/ligas`, ligaRouter);
app.use(`${api}/entrenamientos`, entrenamientosRouter);
app.use(`${api}/partidos`, partidosRouter);
app.use(`${api}/estadisticas`, estadisticasRouter);

export default app;