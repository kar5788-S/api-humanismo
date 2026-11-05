import * as iniciativasService from "../services/iniciativas.services.js";

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

async function responderListado(filtros, res, next) {
    try {
        return res.status(200).json(await iniciativasService.listarIniciativas(filtros));
    } catch (error) {
        return next(error);
    }
}

export async function listar(req, res, next) {
    const activa = validarActiva(req.query.activa, res);
    if (activa === null) {
        return;
    }
    return responderListado({
        titulo: req.query.titulo,
        categoria: req.query.categoria,
        responsable: req.query.responsable,
        activa,
    }, res, next);
}

export async function buscarPorCategoria(req, res, next) {
    const { categoria } = req.query;
    if (categoria !== undefined &&
        (typeof categoria !== "string" || !categoria.trim())) {
        return res.status(400).json({ mensaje: "La categoría debe ser un texto no vacío." });
    }
    return responderListado({ categoria }, res, next);
}

export async function obtenerPorId(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }
    try {
        const iniciativa = await iniciativasService.obtenerIniciativaPorId(id);
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json(iniciativa);
    } catch (error) {
        return next(error);
    }
}

export async function crear(req, res, next) {
    try {
        const iniciativa = await iniciativasService.crearIniciativa(req.body ?? {});
        return res.status(201).json(iniciativa);
    } catch (error) {
        return next(error);
    }
}

export async function actualizar(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }
    try {
        const iniciativa = await iniciativasService.actualizarIniciativa(id, req.body ?? {});
        if (!iniciativa) {
            return res.status(404).json({ mensaje: "Iniciativa no encontrada." });
        }
        return res.status(200).json(iniciativa);
    } catch (error) {
        return next(error);
    }
}

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
    } catch (error) {
        return next(error);
    }
}

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
    } catch (error) {
        return next(error);
    }
}
