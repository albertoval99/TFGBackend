import app from "./server";
import "./context/db/postgres.db"; //❌SI NO LO IMPORTAS NO SE CONECTA❌

const port = 3000;

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port} 🚀`);
});


