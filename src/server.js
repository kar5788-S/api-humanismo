import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/database.js";

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";

try {
    await connectDB();
    app.listen(port, host, () => {
        console.log(`Servidor escuchando en http://${host}:${port}`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exitCode = 1;
}
