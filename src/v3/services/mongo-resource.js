import { getDB } from "../../config/database.js";

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

function normalizarTexto(valor) {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es-MX")
        .trim();
}

export function crearServicioMongo(nombreColeccion, {
    campos,
    filtros,
    campoActivo,
    campoUnico,
}) {
    const coleccion = () => getDB().collection(nombreColeccion);

    async function validarUnico(documento, idExcluir) {
        if (!campoUnico || !documento[campoUnico]) {
            return;
        }

        const documentos = await coleccion()
            .find({}, { projection: { id: 1, [campoUnico]: 1 } })
            .toArray();
        const duplicado = documentos.some((actual) =>
            actual.id !== idExcluir &&
            normalizarTexto(actual[campoUnico]) === normalizarTexto(documento[campoUnico])
        );
        if (duplicado) {
            throw crearError(`Ya existe un registro con ese ${campoUnico}.`, 409);
        }
    }

    async function validarDocumento(documento, esNuevo) {
        for (const [campo, reglas] of Object.entries(campos)) {
            const valor = documento[campo];
            if (valor === undefined) {
                if (esNuevo && reglas.requerido) {
                    throw crearError(`${campo} es obligatorio.`, 400);
                }
                continue;
            }

            if (reglas.tipo === "texto") {
                if (typeof valor !== "string" || !valor.trim()) {
                    throw crearError(`${campo} debe ser un texto no vacío.`, 400);
                }
                documento[campo] = valor.trim();
            } else if (reglas.tipo === "booleano" && typeof valor !== "boolean") {
                throw crearError(`${campo} debe ser booleano.`, 400);
            } else if (reglas.tipo === "entero" &&
                (!Number.isInteger(valor) || valor < (reglas.minimo ?? 1))) {
                throw crearError(`${campo} debe ser un entero válido.`, 400);
            }
        }
    }

    return {
        async listar(opciones = {}) {
            const documentos = await coleccion()
                .find({}, { projection: { _id: 0 } })
                .toArray();

            return documentos.filter((documento) =>
                Object.entries(filtros).every(([filtro, regla]) => {
                    const valor = opciones[filtro];
                    if (valor === undefined || valor === "") {
                        return true;
                    }
                    const actual = documento[regla.campo];
                    if (regla.tipo === "booleano") {
                        return actual === valor;
                    }
                    if (regla.tipo === "exacto") {
                        return normalizarTexto(actual ?? "") === normalizarTexto(valor);
                    }
                    return normalizarTexto(actual ?? "").includes(normalizarTexto(valor));
                })
            );
        },

        async obtenerPorId(id) {
            return coleccion().findOne({ id }, { projection: { _id: 0 } });
        },

        async crear(datos = {}) {
            const documento = {};
            for (const campo of Object.keys(campos)) {
                if (datos[campo] !== undefined) {
                    documento[campo] = datos[campo];
                } else if (campos[campo].predeterminado !== undefined) {
                    documento[campo] = campos[campo].predeterminado;
                }
            }

            await validarDocumento(documento, true);
            await validarUnico(documento);

            const ultimo = await coleccion().find({}, { projection: { id: 1 } })
                .sort({ id: -1 })
                .limit(1)
                .next();
            documento.id = Number.isInteger(ultimo?.id) ? ultimo.id + 1 : 1;
            await coleccion().insertOne(documento);
            return documento;
        },

        async actualizar(id, datos = {}) {
            const actual = await this.obtenerPorId(id);
            if (!actual) {
                return null;
            }

            const cambios = {};
            for (const campo of Object.keys(campos)) {
                if (datos[campo] !== undefined) {
                    cambios[campo] = datos[campo];
                }
            }
            if (Object.keys(cambios).length === 0) {
                throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
            }

            const actualizado = { ...actual, ...cambios };
            await validarDocumento(actualizado, false);
            await validarUnico(actualizado, id);
            await coleccion().updateOne({ id }, { $set: cambios });
            return actualizado;
        },

        async eliminar(id) {
            const documento = await this.obtenerPorId(id);
            if (!documento) {
                return null;
            }
            await coleccion().deleteOne({ id });
            return documento;
        },

        async desactivar(id) {
            const documento = await this.obtenerPorId(id);
            if (!documento) {
                return null;
            }
            const actualizado = { ...documento, [campoActivo]: false };
            await coleccion().updateOne({ id }, { $set: { [campoActivo]: false } });
            return actualizado;
        },
    };
}

export { crearError };
