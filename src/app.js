import express from "express";
import cors from "cors";
// V1
import iniciativasRouterV1 from "./v1/routes/iniciativas.routes.js";
import categoriasRouterV1 from "./v1/routes/categorias.routes.js";
import gruposRouterV1 from "./v1/routes/grupos.routes.js";
import { buscarPorCategoria as buscarPorCategoriaV1 } from "./v1/controllers/iniciativas.controller.js";
// V2
import iniciativasRouterV2 from "./v2/routes/iniciativas.routes.js";
import categoriasRouterV2 from "./v2/routes/categorias.routes.js";
import gruposRouterV2 from "./v2/routes/grupos.routes.js";
import { buscarPorCategoria as buscarPorCategoriaV2 } from "./v2/controllers/iniciativas.controller.js";
//V3
import iniciativasRouterV3 from "./v3/routes/iniciativas.routes.js";
import categoriasRouterV3 from "./v3/routes/categorias.routes.js";
import gruposRouterV3 from "./v3/routes/grupos.routes.js";
import { buscarPorCategoria as buscarPorCategoriaV3 } from "./v3/controllers/iniciativas.controller.js";

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

app.use("/api/v3/iniciativas", iniciativasRouterV3);
app.use("/api/v3/categorias", categoriasRouterV3);
app.use("/api/v3/grupos", gruposRouterV3);
app.get("/api/v3/buscar", buscarPorCategoriaV3);

app.get("/api/v1", (req, res) => {
    res.json({ mensaje: "API V1 disponible", rutas: ["/api/v1/categorias", "/api/v1/iniciativas", "/api/v1/grupos"] });
});
app.get("/api/v2", (req, res) => {
    res.json({ mensaje: "API V2 disponible", rutas: ["/api/v2/categorias", "/api/v2/iniciativas", "/api/v2/grupos"] });
});
app.get("/api/v3", (req, res) => {
    res.json({ mensaje: "API V3 disponible", rutas: ["/api/v3/categorias", "/api/v3/iniciativas", "/api/v3/grupos"] });
});

app.use("/api/iniciativas", iniciativasRouterV3);
app.use("/api/categorias", categoriasRouterV3);
app.use("/api/grupos", gruposRouterV3);
app.get("/buscar", buscarPorCategoriaV3);

app.get("/", (req, res) => {
    res.json({
        message: "API HUMANISMO FUNCIONANDO",
        version: "3.0",
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode
        || err.status
        || (err.name === "ValidationError" || err.name === "CastError" ? 400 : 0)
        || (err.code === 11000 ? 409 : 500);
    const mensaje = err.code === 11000
        ? "Ya existe un registro con un valor único duplicado."
        : err.message || "Error interno del servidor";
    res.status(statusCode).json({ mensaje });
});

export default app;
