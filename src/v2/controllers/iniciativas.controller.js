import * as iniciativasService from "../services/iniciativas.services.js";

function convertirId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function responderError(err, res, next) {
    if (err.statusCode) {
        return res.status(err.statusCode).json({ mensaje: err.message });
    }
    return next(err);
}

// GET /api/iniciativas
export async function listar(req, res, next) {
    try {
        let activa;
        if (req.query.activa !== undefined) {
            if (req.query.activa !== "true" && req.query.activa !== "false") {
                return res.status(400).json({
                    mensaje: "El parámetro 'activa' debe ser 'true' o 'false'.",
                });
            }
            activa = req.query.activa === "true";
        }

        const iniciativas = await iniciativasService.listaIniciativas({
            titulo: req.query.titulo,
            categoria: req.query.categoria,
            responsable: req.query.responsable,
            activa,
        });
        return res.status(200).json(iniciativas);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// GET /api/iniciativas/buscar?categoria=...
export async function buscarPorCategoria(req, res, next) {
    try {
        const { categoria } = req.query;
        if (categoria !== undefined &&
            (typeof categoria !== "string" || !categoria.trim())) {
            return res.status(400).json({
                mensaje: "La categoría debe ser un texto no vacío.",
            });
        }

        const iniciativas = categoria === undefined
            ? await iniciativasService.listaIniciativas()
            : await iniciativasService.listaIniciativas({ categoria });
        return res.status(200).json(iniciativas);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// GET /api/iniciativas/:id
export async function obtenerPorId(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const iniciativa = await iniciativasService.obtenerIniciativaId(id);
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json(iniciativa);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// POST /api/iniciativas
export async function crear(req, res, next) {
    const { titulo, categoria, responsable, activa } = req.body ?? {};
    if (![titulo, categoria, responsable].every(
        (valor) => typeof valor === "string" && valor.trim()
    )) {
        return res.status(400).json({
            mensaje: "titulo, categoria y responsable son obligatorios y deben ser textos no vacíos.",
        });
    }
    if (activa !== undefined && typeof activa !== "boolean") {
        return res.status(400).json({ mensaje: "activa debe ser un valor booleano." });
    }

    try {
        const iniciativa = await iniciativasService.crearIniciativa({
            titulo,
            categoria,
            responsable,
            activa: activa ?? true,
        });
        return res.status(201).json(iniciativa);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// PUT /api/iniciativas/:id (actualización parcial, por compatibilidad)
export async function actualizar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    const { titulo, categoria, responsable, activa } = req.body ?? {};
    const datos = {};
    for (const [campo, valor] of Object.entries({ titulo, categoria, responsable })) {
        if (valor !== undefined) {
            if (typeof valor !== "string" || !valor.trim()) {
                return res.status(400).json({
                    mensaje: `${campo} debe ser un texto no vacío.`,
                });
            }
            datos[campo] = valor.trim();
        }
    }
    if (activa !== undefined) {
        if (typeof activa !== "boolean") {
            return res.status(400).json({ mensaje: "activa debe ser un valor booleano." });
        }
        datos.activa = activa;
    }
    if (Object.keys(datos).length === 0) {
        return res.status(400).json({
            mensaje: "Debe proporcionar al menos un campo válido para actualizar.",
        });
    }

    try {
        const iniciativa = await iniciativasService.actualizarIniciativa(id, datos);
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json(iniciativa);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// PATCH /api/iniciativas/:id/desactivar
export async function desactivar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const iniciativa = await iniciativasService.desactivarIniciativa(id);
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json({
            mensaje: "Iniciativa desactivada correctamente.",
            iniciativa,
        });
    } catch (err) {
        return responderError(err, res, next);
    }
}

// DELETE /api/iniciativas/:id
export async function eliminar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const iniciativa = await iniciativasService.eliminarIniciativa(id);
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json({
            mensaje: "Iniciativa eliminada correctamente.",
            iniciativa,
        });
    } catch (err) {
        return responderError(err, res, next);
    }
}
