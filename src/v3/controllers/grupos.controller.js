import * as gruposService from "../services/grupos.services.js";

function convertirId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function validarActivo(valor, res) {
    if (valor === undefined) {
        return undefined;
    }
    if (valor !== "true" && valor !== "false") {
        res.status(400).json({ mensaje: "El parámetro 'activo' debe ser 'true' o 'false'." });
        return null;
    }
    return valor === "true";
}

export async function listar(req, res, next) {
    const activo = validarActivo(req.query.activo, res);
    if (activo === null) {
        return;
    }
    try {
        const grupos = await gruposService.listarGrupos({
            nombre: req.query.nombre,
            turno: req.query.turno,
            activo,
        });
        return res.status(200).json(grupos);
    } catch (error) {
        return next(error);
    }
}

export async function obtenerPorId(req, res, next) {
    const id = convertirId(req.params.id);
    if (id === null) {
        return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    }
    try {
        const grupo = await gruposService.obtenerGrupoPorId(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json(grupo);
    } catch (error) {
        return next(error);
    }
}

export async function crear(req, res, next) {
    try {
        const grupo = await gruposService.crearGrupo(req.body ?? {});
        return res.status(201).json(grupo);
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
        const grupo = await gruposService.actualizarGrupo(id, req.body ?? {});
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json(grupo);
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
        const grupo = await gruposService.eliminarGrupo(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json({ mensaje: "Grupo eliminado correctamente.", grupo });
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
        const grupo = await gruposService.desactivarGrupo(id);
        if (!grupo) {
            return res.status(404).json({ mensaje: "Grupo no encontrado." });
        }
        return res.status(200).json({ mensaje: "Grupo desactivado correctamente.", grupo });
    } catch (error) {
        return next(error);
    }
}
