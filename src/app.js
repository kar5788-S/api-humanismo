import express from "express";
import cors from "cors";
import iniciativasRouterV1 from "./v1/routes/iniciativas.routes.js";
import categoriasRouterV1 from "./v1/routes/categorias.routes.js";
import gruposRouterV1 from "./v1/routes/grupos.routes.js";
import { buscarPorCategoria as buscarPorCategoriaV1 } from "./v1/controllers/iniciativas.controller.js";
import iniciativasRouterV2 from "./v2/routes/iniciativas.routes.js";
import categoriasRouterV2 from "./v2/routes/categorias.routes.js";
import gruposRouterV2 from "./v2/routes/grupos.routes.js";
import { buscarPorCategoria as buscarPorCategoriaV2 } from "./v2/controllers/iniciativas.controller.js";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/iniciativas", iniciativasRouterV1);
app.use("/api/v1/categorias", categoriasRouterV1);
app.use("/api/v1/grupos", gruposRouterV1);
app.get("/api/v1/buscar", buscarPorCategoriaV1);

app.use("/api/v2/iniciativas", iniciativasRouterV2);
app.use("/api/v2/categorias", categoriasRouterV2);
app.use("/api/v2/grupos", gruposRouterV2);
app.get("/api/v2/buscar", buscarPorCategoriaV2);

app.use("/api/iniciativas", iniciativasRouterV1);
app.use("/api/categorias", categoriasRouterV1);
app.use("/api/grupos", gruposRouterV1);
app.get("/buscar", buscarPorCategoriaV1);

app.get("/", (req, res) => {
    res.json({
        message: "API HUMANISMO FUNCIONANDO",
        version: "1.0",
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ mensaje: err.message || "Error interno del servidor" });
});

export default app;
