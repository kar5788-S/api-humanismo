// Cargar variables de entorno
import 'dotenv/config';

// Importar aplicación express
import { app } from "./app.js";

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Servidor escuchando en http://${host}:${port}`);
});