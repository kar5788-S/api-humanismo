import { getDB } from "../../config/database.js";
import { calcularSiguienteId, crearError, textoRegex } from "./mongo-helpers.js";

function coleccion() {
    return getDB().collection("iniciativas");
}

export async function obtenerIniciativas() {
    return coleccion().find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function listaIniciativas({ titulo, categoria, responsable, activa } = {}) {
    const filtro = {};
    for (const [campo, valor] of Object.entries({ titulo, responsable })) {
        if (typeof valor === "string" && valor.trim()) {
            filtro[campo] = { $regex: textoRegex(valor.trim()), $options: "i" };
        }
    }
    if (typeof categoria === "string" && categoria.trim()) {
        filtro.categoria = { $regex: `^${textoRegex(categoria.trim())}$`, $options: "i" };
    }
    if (typeof activa === "boolean") {
        filtro.activa = activa;
    }
    return coleccion().find(filtro, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function obtenerIniciativaId(id) {
    return coleccion().findOne({ id }, { projection: { _id: 0 } });
}

export async function crearIniciativa({ titulo, categoria, responsable, activa = true } = {}) {
    const documento = { titulo, categoria, responsable };
    for (const [campo, valor] of Object.entries(documento)) {
        if (typeof valor !== "string" || !valor.trim()) {
            throw crearError(`${campo} es obligatorio y debe ser un texto no vacío.`, 400);
        }
        documento[campo] = valor.trim();
    }
    if (typeof activa !== "boolean") {
        throw crearError("activa debe ser un valor booleano.", 400);
    }
    const iniciativa = {
        id: await calcularSiguienteId(coleccion()),
        ...documento,
        activa,
    };
    await coleccion().insertOne(iniciativa);
    return iniciativa;
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
    if (!Object.keys(cambios).length) {
        throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
    }
    return coleccion().findOneAndUpdate(
        { id },
        { $set: cambios },
        { returnDocument: "after", projection: { _id: 0 } }
    );
}

export async function eliminarIniciativa(id) {
    const iniciativa = await obtenerIniciativaId(id);
    if (!iniciativa) {
        return null;
    }
    await coleccion().deleteOne({ id });
    return iniciativa;
}

export async function desactivarIniciativa(id) {
    return coleccion().findOneAndUpdate(
        { id },
        { $set: { activa: false } },
        { returnDocument: "after", projection: { _id: 0 } }
    );
}
