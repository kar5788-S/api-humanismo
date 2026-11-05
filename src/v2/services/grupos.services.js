import { getDB } from "../../config/database.js";
import { calcularSiguienteId, crearError, textoRegex } from "./mongo-helpers.js";

function coleccion() {
    return getDB().collection("grupos");
}

export async function obtenerGrupos() {
    return coleccion().find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function listaGrupos({ nombre, turno, activo } = {}) {
    const filtro = {};
    if (typeof nombre === "string" && nombre.trim()) {
        filtro.nombre = { $regex: textoRegex(nombre.trim()), $options: "i" };
    }
    if (typeof turno === "string" && turno.trim()) {
        filtro.turno = { $regex: `^${textoRegex(turno.trim())}$`, $options: "i" };
    }
    if (typeof activo === "boolean") {
        filtro.activo = activo;
    }
    return coleccion().find(filtro, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function obtenerGrupoId(id) {
    return coleccion().findOne({ id }, { projection: { _id: 0 } });
}

export async function crearGrupo({ nombre, grado, grupo, turno, activo = true } = {}) {
    const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
    const grupoListo = typeof grupo === "string" ? grupo.trim() : "";
    const turnoListo = typeof turno === "string" ? turno.trim() : "";
    if (!nombreListo || !grupoListo || !turnoListo) {
        throw crearError("nombre, grupo y turno son obligatorios.", 400);
    }
    if (!Number.isInteger(grado) || grado < 1) {
        throw crearError("El grado debe ser un entero positivo.", 400);
    }
    if (typeof activo !== "boolean") {
        throw crearError("activo debe ser un valor booleano.", 400);
    }
    const duplicado = await coleccion().findOne({
        nombre: { $regex: `^${textoRegex(nombreListo)}$`, $options: "i" },
    });
    if (duplicado) {
        throw crearError("Ya existe un grupo con ese nombre.", 409);
    }

    const nuevoGrupo = {
        id: await calcularSiguienteId(coleccion()),
        nombre: nombreListo,
        grado,
        grupo: grupoListo,
        turno: turnoListo,
        activo,
    };
    await coleccion().insertOne(nuevoGrupo);
    return nuevoGrupo;
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
    if (datos.grado !== undefined) {
        if (!Number.isInteger(datos.grado) || datos.grado < 1) {
            throw crearError("El grado debe ser un entero positivo.", 400);
        }
        cambios.grado = datos.grado;
    }
    if (datos.activo !== undefined) {
        if (typeof datos.activo !== "boolean") {
            throw crearError("activo debe ser un valor booleano.", 400);
        }
        cambios.activo = datos.activo;
    }
    if (!Object.keys(cambios).length) {
        throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
    }
    if (cambios.nombre) {
        const duplicado = await coleccion().findOne({
            id: { $ne: id },
            nombre: { $regex: `^${textoRegex(cambios.nombre)}$`, $options: "i" },
        });
        if (duplicado) {
            throw crearError("Ya existe otro grupo con ese nombre.", 409);
        }
    }
    return coleccion().findOneAndUpdate(
        { id },
        { $set: cambios },
        { returnDocument: "after", projection: { _id: 0 } }
    );
}

export async function eliminarGrupo(id) {
    const grupo = await obtenerGrupoId(id);
    if (!grupo) {
        return null;
    }
    await coleccion().deleteOne({ id });
    return grupo;
}

export async function desactivarGrupo(id) {
    return coleccion().findOneAndUpdate(
        { id },
        { $set: { activo: false } },
        { returnDocument: "after", projection: { _id: 0 } }
    );
}
