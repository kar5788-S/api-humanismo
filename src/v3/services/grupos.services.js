import Grupo from "../models/grupos.model.js";

function regexSeguro(texto, exacto = false) {
    const escapado = texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(exacto ? `^${escapado}$` : escapado, "i");
}

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

async function calcularSiguienteId() {
    const ultimoGrupo = await Grupo.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    return ultimoGrupo?.id ? ultimoGrupo.id + 1 : 1;
}

export async function listarGrupos({ nombre, turno, activo } = {}) {
    const filtro = {};
    if (typeof nombre === "string" && nombre.trim()) {
        filtro.nombre = regexSeguro(nombre.trim());
    }
    if (typeof turno === "string" && turno.trim()) {
        filtro.turno = regexSeguro(turno.trim(), true);
    }
    if (typeof activo === "boolean") {
        filtro.activo = activo;
    }
    return Grupo.find(filtro).sort({ id: 1 });
}

export async function obtenerGrupoPorId(id) {
    return Grupo.findOne({ id });
}

export async function crearGrupo(datos = {}) {
    const nombre = typeof datos.nombre === "string" ? datos.nombre.trim() : "";
    const nombreDuplicado = nombre
        ? await Grupo.exists({ nombre: regexSeguro(nombre, true) })
        : false;
    if (!nombre) {
        throw crearError("El nombre del grupo es obligatorio.", 400);
    }
    if (nombreDuplicado) {
        throw crearError("Ya existe un grupo con ese nombre.", 409);
    }
    if (!Number.isInteger(datos.grado) || datos.grado < 1) {
        throw crearError("El grado debe ser un entero positivo.", 400);
    }
    const grupo = typeof datos.grupo === "string" ? datos.grupo.trim() : "";
    const turno = typeof datos.turno === "string" ? datos.turno.trim() : "";
    if (!grupo || !turno) {
        throw crearError("Los campos grupo y turno son obligatorios.", 400);
    }
    if (datos.activo !== undefined && typeof datos.activo !== "boolean") {
        throw crearError("El campo activo debe ser booleano.", 400);
    }

    return Grupo.create({
        id: await calcularSiguienteId(),
        nombre,
        grado: datos.grado,
        grupo,
        turno,
        activo: datos.activo ?? true,
    });
}

export async function actualizarGrupo(id, datos = {}) {
    const cambios = {};
    for (const campo of ["nombre", "grupo", "turno"]) {
        if (datos[campo] !== undefined) {
            if (typeof datos[campo] !== "string" || !datos[campo].trim()) {
                throw crearError(`${campo} debe ser un texto no vacío.`, 400);
            }
            cambios[campo] = datos[campo].trim();
        }
    }
    if (cambios.nombre !== undefined) {
        const nombreDuplicado = await Grupo.exists({
            id: { $ne: id },
            nombre: regexSeguro(cambios.nombre, true),
        });
        if (nombreDuplicado) {
            throw crearError("Ya existe otro grupo con ese nombre.", 409);
        }
    }
    if (datos.grado !== undefined) {
        if (!Number.isInteger(datos.grado) || datos.grado < 1) {
            throw crearError("El grado debe ser un entero positivo.", 400);
        }
        cambios.grado = datos.grado;
    }
    if (datos.activo !== undefined) {
        if (typeof datos.activo !== "boolean") {
            throw crearError("El campo activo debe ser booleano.", 400);
        }
        cambios.activo = datos.activo;
    }
    if (Object.keys(cambios).length === 0) {
        throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
    }

    return Grupo.findOneAndUpdate(
        { id },
        { $set: cambios },
        { new: true, runValidators: true }
    );
}

export async function eliminarGrupo(id) {
    return Grupo.findOneAndDelete({ id });
}

export async function desactivarGrupo(id) {
    return Grupo.findOneAndUpdate(
        { id },
        { $set: { activo: false } },
        { new: true, runValidators: true }
    );
}
