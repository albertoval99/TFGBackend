import swaggerAutogen from "swagger-autogen"; 
//npm i swagger-autogen    npm i swagger-ui-express

const doc = {
  info: {
    title: "Football Zone API",
    description: "API",
  },
  host: "localhost:8080",
};

const outputFile = "../doc/swagger.json";
const routes = ["./server.ts"]; 

swaggerAutogen()(outputFile, routes, doc);
