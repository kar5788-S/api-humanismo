import Iniciativa from "../models/iniciativas.model.js";

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
    const ultimaIniciativa = await Iniciativa.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    return ultimaIniciativa?.id ? ultimaIniciativa.id + 1 : 1;
}

export async function listarIniciativas({ titulo, categoria, responsable, activa } = {}) {
    const filtro = {};
    if (typeof titulo === "string" && titulo.trim()) {
        filtro.titulo = regexSeguro(titulo.trim());
    }
    if (typeof categoria === "string" && categoria.trim()) {
        filtro.categoria = regexSeguro(categoria.trim(), true);
    }
    if (typeof responsable === "string" && responsable.trim()) {
        filtro.responsable = regexSeguro(responsable.trim());
    }
    if (typeof activa === "boolean") {
        filtro.activa = activa;
    }
    return Iniciativa.find(filtro).sort({ id: 1 });
}

export async function obtenerIniciativaPorId(id) {
    return Iniciativa.findOne({ id });
}

export async function crearIniciativa(datos = {}) {
    const titulo = typeof datos.titulo === "string" ? datos.titulo.trim() : "";
    const categoria = typeof datos.categoria === "string" ? datos.categoria.trim() : "";
    const responsable = typeof datos.responsable === "string"
        ? datos.responsable.trim()
        : "";
    if (!titulo || !categoria || !responsable) {
        throw crearError(
            "titulo, categoria y responsable son obligatorios y deben ser textos no vacíos.",
            400
        );
    }
    if (datos.activa !== undefined && typeof datos.activa !== "boolean") {
        throw crearError("activa debe ser un valor booleano.", 400);
    }

    return Iniciativa.create({
        id: await calcularSiguienteId(),
        titulo,
        categoria,
        responsable,
        activa: datos.activa ?? true,
    });
}

export async function actualizarIniciativa(id, datos = {}) {
    const cambios = {};
    for (const campo of ["titulo", "categoria", "responsable"]) {
        if (datos[campo] !== undefined) {
            if (typeof datos[campo] !== "string" || !datos[campo].trim()) {
                throw crearError(`${campo} debe ser un texto no vacío.`, 400);
            }
            cambios[campo] = datos[campo].trim();
        }
    }
    if (datos.activa !== undefined) {
        if (typeof datos.activa !== "boolean") {
            throw crearError("activa debe ser un valor booleano.", 400);
        }
        cambios.activa = datos.activa;
    }
    if (Object.keys(cambios).length === 0) {
        throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
    }

    return Iniciativa.findOneAndUpdate(
        { id },
        { $set: cambios },
        { new: true, runValidators: true }
    );
}

export async function eliminarIniciativa(id) {
    return Iniciativa.findOneAndDelete({ id });
}

export async function desactivarIniciativa(id) {
    return Iniciativa.findOneAndUpdate(
        { id },
        { $set: { activa: false } },
        { new: true, runValidators: true }
    );
}
