import { getDB } from "../../config/database.js";
import { calcularSiguienteId, crearError, textoRegex } from "./mongo-helpers.js";

function coleccion() {
    return getDB().collection("categorias");
}

export async function obtenerCategorias() {
    return coleccion().find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function listaCategorias({ nombre, activa } = {}) {
    const filtro = {};
    if (typeof nombre === "string" && nombre.trim()) {
        filtro.nombre = { $regex: textoRegex(nombre.trim()), $options: "i" };
    }
    if (typeof activa === "boolean") {
        filtro.activa = activa;
    }
    return coleccion().find(filtro, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function obtenerCategoriaId(id) {
    return coleccion().findOne({ id }, { projection: { _id: 0 } });
}

export async function crearCategoria({ nombre, descripcion, activa = true } = {}) {
    const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
    const descripcionLista = typeof descripcion === "string" ? descripcion.trim() : "";
    if (!nombreListo || !descripcionLista) {
        throw crearError("El nombre y la descripción de la categoría son obligatorios.", 400);
    }
    if (typeof activa !== "boolean") {
        throw crearError("El campo activa debe ser booleano.", 400);
    }
    const duplicada = await coleccion().findOne({
        nombre: { $regex: `^${textoRegex(nombreListo)}$`, $options: "i" },
    });
    if (duplicada) {
        throw crearError("Ya existe una categoría con ese nombre.", 409);
    }

    const categoria = {
        id: await calcularSiguienteId(coleccion()),
        nombre: nombreListo,
        descripcion: descripcionLista,
        activa,
    };
    await coleccion().insertOne(categoria);
    return categoria;
}

export async function actualizarCategoria(id, datos = {}) {
    const cambios = {};
    if (datos.nombre !== undefined) {
        if (typeof datos.nombre !== "string" || !datos.nombre.trim()) {
            throw crearError("El nombre no puede estar vacío.", 400);
        }
        cambios.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
        if (typeof datos.descripcion !== "string" || !datos.descripcion.trim()) {
            throw crearError("La descripción no puede estar vacía.", 400);
        }
        cambios.descripcion = datos.descripcion.trim();
    }
    if (datos.activa !== undefined) {
        if (typeof datos.activa !== "boolean") {
            throw crearError("El campo activa debe ser booleano.", 400);
        }
        cambios.activa = datos.activa;
    }
    if (Object.keys(cambios).length === 0) {
        throw crearError("Debe proporcionar al menos un campo para actualizar.", 400);
    }
    if (cambios.nombre) {
        const duplicada = await coleccion().findOne({
            id: { $ne: id },
            nombre: { $regex: `^${textoRegex(cambios.nombre)}$`, $options: "i" },
        });
        if (duplicada) {
            throw crearError("Ya existe otra categoría con ese nombre.", 409);
        }
    }
    const resultado = await coleccion().findOneAndUpdate(
        { id },
        { $set: cambios },
        { returnDocument: "after", projection: { _id: 0 } }
    );
    return resultado;
}

export async function eliminarCategoria(id) {
    const categoria = await obtenerCategoriaId(id);
    if (!categoria) {
        return null;
    }
    await coleccion().deleteOne({ id });
    return categoria;
}
