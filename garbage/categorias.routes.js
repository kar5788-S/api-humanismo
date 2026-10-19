import { Router } from "express";
import {
    listaCategorias,
    obtenerCategoriaId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    desactivarCategoria,
} from "../services/categorias.services.js";

const router = Router();

// GET /api/categorias
router.get("/", async (req, res) => {
    try {
        const { nombre, activa } = req.query;

        let filtroActiva;
        if (activa !== undefined) {
            if (activa !== "true" && activa !== "false") {
                return res.status(400).json({
                    mensaje: "El parámetro 'activa' debe ser 'true' o 'false'.",
                });
            }
            filtroActiva = activa === "true";
        }

        const categorias = await listaCategorias({
            nombre,
            activa: filtroActiva,
        });

        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las categorías.",
            error: error.message,
        });
    }
});

// GET /api/categorias/:id
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensaje: "El ID debe ser un entero positivo.",
            });
        }

        const categoria = await obtenerCategoriaId(id);
        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada.",
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la categoría.",
            error: error.message,
        });
    }
});

// POST /api/categorias
router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion, activa } = req.body ?? {};

        if (
            typeof nombre !== "string" || !nombre.trim() ||
            typeof descripcion !== "string" || !descripcion.trim()
        ) {
            return res.status(400).json({
                mensaje: "nombre y descripcion son obligatorios y deben ser textos no vacíos.",
            });
        }

        if (activa !== undefined && typeof activa !== "boolean") {
            return res.status(400).json({
                mensaje: "El campo activa debe ser booleano.",
            });
        }

        const nuevaCategoria = await crearCategoria({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            activa: activa ?? true,
        });

        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(error.statusCode ?? 500).json({
            mensaje: error.message || "Error al crear la categoría.",
        });
    }
});

// PUT /api/categorias/:id
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensaje: "El ID debe ser un entero positivo.",
            });
        }

        const { nombre, descripcion, activa } = req.body ?? {};
        const datosActualizacion = {};

        if (nombre !== undefined) {
            if (typeof nombre !== "string" || !nombre.trim()) {
                return res.status(400).json({
                    mensaje: "nombre debe ser un texto no vacío.",
                });
            }
            datosActualizacion.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            if (typeof descripcion !== "string" || !descripcion.trim()) {
                return res.status(400).json({
                    mensaje: "descripcion debe ser un texto no vacío.",
                });
            }
            datosActualizacion.descripcion = descripcion.trim();
        }

        if (activa !== undefined) {
            if (typeof activa !== "boolean") {
                return res.status(400).json({
                    mensaje: "activa debe ser un valor booleano.",
                });
            }
            datosActualizacion.activa = activa;
        }

        if (Object.keys(datosActualizacion).length === 0) {
            return res.status(400).json({
                mensaje: "Debe proporcionar al menos un campo válido para actualizar.",
            });
        }

        const categoriaActualizada = await actualizarCategoria(id, datosActualizacion);
        if (!categoriaActualizada) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada.",
            });
        }

        res.status(200).json(categoriaActualizada);
    } catch (error) {
        res.status(error.statusCode ?? 500).json({
            mensaje: error.message || "Error al actualizar la categoría.",
        });
    }
});

// PATCH /api/categorias/:id/desactivar
router.patch("/:id/desactivar", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensaje: "El ID debe ser un entero positivo.",
            });
        }

        const categoria = await desactivarCategoria(id);
        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada.",
            });
        }

        res.status(200).json({
            mensaje: "Categoría desactivada correctamente.",
            categoria,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al desactivar la categoría.",
            error: error.message,
        });
    }
});

// DELETE /api/categorias/:id
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                mensaje: "El ID debe ser un entero positivo.",
            });
        }

        const categoriaEliminada = await eliminarCategoria(id);
        if (!categoriaEliminada) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada.",
            });
        }

        res.status(200).json({
            mensaje: "Categoría eliminada correctamente.",
            categoria: categoriaEliminada,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la categoría.",
            error: error.message,
        });
    }
});

export default router;