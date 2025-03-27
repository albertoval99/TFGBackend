import express from "express";
import usuarioRouter from "./usuarios/infrastructure/rest/usuario.rest"

const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../doc/swagger.json");

const cors = require('cors');
const corsOptions = {
   origin: "*"

}
app.use(cors(corsOptions));

app.use(express.json());

//http://localhost:3000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const api = "/api";
app.use(`${api}/usuarios`, usuarioRouter);

export default app;
