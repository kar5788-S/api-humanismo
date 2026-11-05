import "dotenv/config";
import { app } from "./app.js";
import { connectDB as connectMongoDB } from "./config/database.js";
import { connectDB as connectMongoose } from "./config/database.mongoose.js";

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";

try {
    await Promise.all([connectMongoDB(), connectMongoose()]);
    app.listen(port, host, () => {
        const baseUrl = `http://localhost:${port}`;
        console.log("Se pudo conectar a MongoDB.");
        console.log(`API V1 disponible en: ${baseUrl}/api/v1`);
        console.log(`API V2 disponible en: ${baseUrl}/api/v2`);
        console.log(`API V3 disponible en: ${baseUrl}/api/v3`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exitCode = 1;
}
