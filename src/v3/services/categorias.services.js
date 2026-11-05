import Categoria from "../models/categorias.model.js";

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
    const ultimaCategoria = await Categoria.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    return ultimaCategoria?.id ? ultimaCategoria.id + 1 : 1;
}

export async function listarCategorias({ nombre, activa } = {}) {
    const filtro = {};
    if (typeof nombre === "string" && nombre.trim()) {
        filtro.nombre = regexSeguro(nombre.trim());
    }
    if (typeof activa === "boolean") {
        filtro.activa = activa;
    }
    return Categoria.find(filtro).sort({ nombre: 1 });
}

export const obtenerCategorias = listarCategorias;

export async function obtenerCategoriaPorId(id) {
    return Categoria.findOne({ id });
}

export async function crearCategoria(datos = {}) {
    const nombre = typeof datos.nombre === "string" ? datos.nombre.trim() : "";
    const descripcion = typeof datos.descripcion === "string"
        ? datos.descripcion.trim()
        : "";
    if (!nombre) {
        throw crearError("El nombre de la categoría es obligatorio.", 400);
    }
    if (!descripcion) {
        throw crearError("La descripción de la categoría es obligatoria.", 400);
    }
    if (datos.activa !== undefined && typeof datos.activa !== "boolean") {
        throw crearError("El campo activa debe ser booleano.", 400);
    }

    const duplicada = await Categoria.exists({ nombre: regexSeguro(nombre, true) });
    if (duplicada) {
        throw crearError("Ya existe una categoría con ese nombre.", 409);
    }

    return Categoria.create({
        id: await calcularSiguienteId(),
        nombre,
        descripcion,
        activa: datos.activa ?? true,
    });
}

export async function actualizarCategoria(id, datos = {}) {
    const cambios = {};
    for (const campo of ["nombre", "descripcion", "activa"]) {
        if (datos[campo] !== undefined) {
            cambios[campo] = datos[campo];
        }
    }
    if (Object.keys(cambios).length === 0) {
        throw crearError("Debe proporcionar al menos un campo válido para actualizar.", 400);
    }
    if (cambios.nombre !== undefined && typeof cambios.nombre === "string") {
        cambios.nombre = cambios.nombre.trim();
        const duplicada = await Categoria.exists({
            id: { $ne: id },
            nombre: regexSeguro(cambios.nombre, true),
        });
        if (duplicada) {
            throw crearError("Ya existe otra categoría con ese nombre.", 409);
        }
    }
    return Categoria.findOneAndUpdate(
        { id },
        { $set: cambios },
        { new: true, runValidators: true }
    );
}

export async function eliminarCategoria(id) {
    return Categoria.findOneAndDelete({ id });
}

export async function desactivarCategoria(id) {
    return Categoria.findOneAndUpdate(
        { id },
        { $set: { activa: false } },
        { new: true, runValidators: true }
    );
}
