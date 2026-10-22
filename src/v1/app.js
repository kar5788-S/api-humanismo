import express from "express";
export const app = express();

// Importar rutas
import iniciativasRouter from "./routes/iniciativas.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import gruposRouter from "./routes/grupos.routes.js";
import { buscarPorCategoria } from "./controllers/iniciativas.controller.js";
// import cors from "cors";

app.use(express.json());
// app.use(cors());

// Montar las rutas en la URL
app.use("/api/iniciativas", iniciativasRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/grupos", gruposRouter);
app.get("/buscar", buscarPorCategoria);

app.get("/", (req, res) => {
    res.json({
        message: "API HUMANISMO FUNCIONANDO",
        version: "1.0",
    });
});

// Middleware para el manejo de errores, debe colocarse después de las rutas
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ mensaje: err.message || "Error interno del servidor" });
});

export default app;