import app from "./server";
import "./context/db/postgres.db"; //❌SI NO LO IMPORTAS NO SE CONECTA❌

//const port = 3002;
const port = 3000; //Para localhost y despliegue este

app.listen( port,  () => {
  console.log('🚀 Servidor corriendo en:');
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Red: http://192.168.20.134:${port}`);
});
/**
 * app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port} 🚀`);
});
 */