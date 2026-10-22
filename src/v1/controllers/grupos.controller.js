import * as gruposService from "../services/grupos.services.js";

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

// GET /api/grupos
export async function listar(req, res, next) {
    try {
        let activo;
        if (req.query.activo !== undefined) {
            if (req.query.activo !== "true" && req.query.activo !== "false") {
                return res.status(400).json({
                    mensaje: "El parámetro 'activo' debe ser 'true' o 'false'.",
                });
            }
            activo = req.query.activo === "true";
        }

        const grupos = await gruposService.listaGrupos({
            nombre: req.query.nombre,
            turno: req.query.turno,
            activo,
        });
        return res.status(200).json(grupos);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// GET /api/grupos/:id
export async function obtenerPorId(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const grupo = await gruposService.obtenerGrupoId(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json(grupo);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// POST /api/grupos
export async function crear(req, res, next) {
    const { nombre, grado, grupo, turno, activo } = req.body ?? {};
    if (typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({
            mensaje: "El nombre es obligatorio y debe ser un texto no vacío.",
        });
    }
    if (!Number.isInteger(grado) || grado < 1) {
        return res.status(400).json({ mensaje: "El grado debe ser un entero positivo." });
    }
    if (typeof grupo !== "string" || !grupo.trim()) {
        return res.status(400).json({
            mensaje: "El campo grupo es obligatorio y debe ser un texto no vacío.",
        });
    }
    if (typeof turno !== "string" || !turno.trim()) {
        return res.status(400).json({
            mensaje: "El turno es obligatorio y debe ser un texto no vacío.",
        });
    }
    if (activo !== undefined && typeof activo !== "boolean") {
        return res.status(400).json({ mensaje: "El campo activo debe ser booleano." });
    }

    try {
        const grupoCreado = await gruposService.crearGrupo({
            nombre,
            grado,
            grupo,
            turno,
            activo: activo ?? true,
        });
        return res.status(201).json(grupoCreado);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// PUT /api/grupos/:id (actualización parcial, por compatibilidad)
export async function actualizar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    const { nombre, grado, grupo, turno, activo } = req.body ?? {};
    const datos = {};

    if (nombre !== undefined) {
        if (typeof nombre !== "string" || !nombre.trim()) {
            return res.status(400).json({ mensaje: "nombre debe ser un texto no vacío." });
        }
        datos.nombre = nombre.trim();
    }
    if (grado !== undefined) {
        if (!Number.isInteger(grado) || grado < 1) {
            return res.status(400).json({ mensaje: "grado debe ser un entero positivo." });
        }
        datos.grado = grado;
    }
    if (grupo !== undefined) {
        if (typeof grupo !== "string" || !grupo.trim()) {
            return res.status(400).json({ mensaje: "grupo debe ser un texto no vacío." });
        }
        datos.grupo = grupo.trim();
    }
    if (turno !== undefined) {
        if (typeof turno !== "string" || !turno.trim()) {
            return res.status(400).json({ mensaje: "turno debe ser un texto no vacío." });
        }
        datos.turno = turno.trim();
    }
    if (activo !== undefined) {
        if (typeof activo !== "boolean") {
            return res.status(400).json({ mensaje: "activo debe ser un valor booleano." });
        }
        datos.activo = activo;
    }
    if (Object.keys(datos).length === 0) {
        return res.status(400).json({
            mensaje: "Debe proporcionar al menos un campo válido para actualizar.",
        });
    }

    try {
        const grupoActualizado = await gruposService.actualizarGrupo(id, datos);
        if (!grupoActualizado) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json(grupoActualizado);
    } catch (err) {
        return responderError(err, res, next);
    }
}

// PATCH /api/grupos/:id/desactivar
export async function desactivar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const grupo = await gruposService.desactivarGrupo(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json({
            mensaje: "Grupo desactivado correctamente.",
            grupo,
        });
    } catch (err) {
        return responderError(err, res, next);
    }
}

// DELETE /api/grupos/:id
export async function eliminar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }

    try {
        const grupo = await gruposService.eliminarGrupo(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json({
            mensaje: "Grupo eliminado correctamente.",
            grupo,
        });
    } catch (err) {
        return responderError(err, res, next);
    }
}
