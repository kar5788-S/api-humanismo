function convertirId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export function crearControlador(servicio, {
    filtros,
    campoActivo,
    nombreRecurso,
    respuestaLista,
}) {
    function responderError(error, res, next) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ mensaje: error.message });
        }
        return next(error);
    }

    async function listar(req, res, next) {
        try {
            const opciones = {};
            for (const filtro of filtros) {
                if (typeof req.query[filtro] === "string") {
                    opciones[filtro] = req.query[filtro].trim();
                }
            }
            if (req.query[campoActivo] !== undefined) {
                const valorActivo = req.query[campoActivo];
                if (valorActivo !== "true" && valorActivo !== "false") {
                    return res.status(400).json({
                        mensaje: `El parámetro '${campoActivo}' debe ser 'true' o 'false'.`,
                    });
                }
                opciones[campoActivo] = valorActivo === "true";
            }

            const documentos = await servicio.listar(opciones);
            return res.status(200).json(respuestaLista
                ? respuestaLista(documentos)
                : documentos);
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    async function obtenerPorId(req, res, next) {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
        }
        try {
            const documento = await servicio.obtenerPorId(id);
            if (!documento) {
                return res.status(404).json({ mensaje: `${nombreRecurso} no encontrado.` });
            }
            return res.status(200).json(documento);
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    async function crear(req, res, next) {
        try {
            const documento = await servicio.crear(req.body ?? {});
            return res.status(201).json(documento);
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    async function actualizar(req, res, next) {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
        }
        try {
            const documento = await servicio.actualizar(id, req.body ?? {});
            if (!documento) {
                return res.status(404).json({ mensaje: `${nombreRecurso} no encontrado.` });
            }
            return res.status(200).json(documento);
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    async function eliminar(req, res, next) {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
        }
        try {
            const documento = await servicio.eliminar(id);
            if (!documento) {
                return res.status(404).json({ mensaje: `${nombreRecurso} no encontrado.` });
            }
            return res.status(200).json({
                mensaje: `${nombreRecurso} eliminado correctamente.`,
                datos: documento,
            });
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    async function desactivar(req, res, next) {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
        }
        try {
            const documento = await servicio.desactivar(id);
            if (!documento) {
                return res.status(404).json({ mensaje: `${nombreRecurso} no encontrado.` });
            }
            return res.status(200).json({
                mensaje: `${nombreRecurso} desactivado correctamente.`,
                datos: documento,
            });
        } catch (error) {
            return responderError(error, res, next);
        }
    }

    return { listar, buscarPorCategoria: listar, obtenerPorId, crear, actualizar, eliminar, desactivar };
}
