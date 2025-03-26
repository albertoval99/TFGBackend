import swaggerAutogen from "swagger-autogen"; 
//npm i swagger-autogen    npm i swagger-ui-express

const doc = {
  info: {
    title: "CafeShop API",
    description: "API",
  },
  host: "localhost:8080",
};

const outputFile = "../doc/swagger.json";
const routes = ["./server.ts"]; //esta ruta apunta a la raíz del proyecto donde están definidas todas las rutas

swaggerAutogen()(outputFile, routes, doc);
