import * as categoriasService from "../services/categorias.services.js";

function convertirId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function validarActiva(valor, res) {
    if (valor === undefined) {
        return undefined;
    }
    if (valor !== "true" && valor !== "false") {
        res.status(400).json({ mensaje: "El parámetro 'activa' debe ser 'true' o 'false'." });
        return null;
    }
    return valor === "true";
}

export async function listar(req, res, next) {
    const activa = validarActiva(req.query.activa, res);
    if (activa === null) {
        return;
    }
    try {
        const categorias = await categoriasService.listarCategorias({
            nombre: typeof req.query.nombre === "string" ? req.query.nombre.trim() : undefined,
            activa,
        });
        return res.status(200).json({ noCategorias: categorias.length, datos: categorias });
    } catch (error) {
        return next(error);
    }
}

export async function obtenerPorId(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({
            mensaje: "El ID de la categoría debe ser un número entero positivo.",
        });
    }
    try {
        const categoria = await categoriasService.obtenerCategoriaPorId(id);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json(categoria);
    } catch (error) {
        return next(error);
    }
}

export async function crear(req, res, next) {
    try {
        const categoria = await categoriasService.crearCategoria(req.body ?? {});
        return res.status(201).json(categoria);
    } catch (error) {
        return next(error);
    }
}

export async function actualizar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({
            mensaje: "El ID de la categoría debe ser un número entero positivo.",
        });
    }
    try {
        const categoria = await categoriasService.actualizarCategoria(id, req.body ?? {});
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json(categoria);
    } catch (error) {
        return next(error);
    }
}

export async function eliminar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({
            mensaje: "El ID de la categoría debe ser un número entero positivo.",
        });
    }
    try {
        const categoria = await categoriasService.eliminarCategoria(id);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json({
            mensaje: "Categoría eliminada correctamente.",
            datos: categoria,
        });
    } catch (error) {
        return next(error);
    }
}

export async function desactivar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({
            mensaje: "El ID de la categoría debe ser un número entero positivo.",
        });
    }
    try {
        const categoria = await categoriasService.desactivarCategoria(id);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json({
            mensaje: "Categoría desactivada correctamente.",
            datos: categoria,
        });
    } catch (error) {
        return next(error);
    }
}
