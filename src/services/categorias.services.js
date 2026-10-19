// Servicio para las operaciones y reglas de negocio de categorías.
// Lee y escribe en data/categorias.json.

import { readFile, writeFile } from "node:fs/promises";

const rutaCategorias = new URL("../data/categorias.json", import.meta.url);

// Utilidades

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

function normalizarTexto(valor = "") {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es-MX")
        .trim();
}

// Lectura / escritura del archivo

async function leerCategorias() {
    const contenido = await readFile(rutaCategorias, "utf8");
    return JSON.parse(contenido);
}

async function guardarCategorias(categorias) {
    await writeFile(rutaCategorias, JSON.stringify(categorias, null, 2), "utf8");
    return categorias;
}


// Listar todas las categorías o aplicar filtros opcionales
// ({ nombre, activa }) desde query params.
export async function obtenerCategorias() {
    return await leerCategorias();
}

export async function listaCategorias({ nombre, activa } = {}) {
    let categorias = await leerCategorias();

    if (typeof nombre === "string" && nombre.trim() !== "") {
        categorias = categorias.filter((categoria) =>
            normalizarTexto(categoria.nombre).includes(normalizarTexto(nombre))
        );
    }

    if (typeof activa === "boolean") {
        categorias = categorias.filter((categoria) => categoria.activa === activa);
    }

    return categorias;
}

// Obtener una categoría por ID
export async function obtenerCategoriaId(id) {
    const categorias = await leerCategorias();
    return categorias.find((categoria) => categoria.id === id) ?? null;
}

// Crear una categoría nueva y guardarla en el JSON
export async function crearCategoria({ nombre, descripcion, activa = true } = {}) {
    const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
    const descripcionListo = typeof descripcion === "string" ? descripcion.trim() : "";

    if (!nombreListo) {
        throw crearError("El nombre de la categoría es obligatorio.", 400);
    }
    if (!descripcionListo) {
        throw crearError("La descripción de la categoría es obligatoria.", 400);
    }
    if (typeof activa !== "boolean") {
        throw crearError("El campo activa debe ser booleano.", 400);
    }

    const categorias = await leerCategorias();

    const existe = categorias.some(
        (categoria) =>
            normalizarTexto(categoria.nombre) === normalizarTexto(nombreListo)
    );
    if (existe) {
        throw crearError("Ya existe una categoría con ese nombre.", 409);
    }

    const nuevoId =
        categorias.length > 0 ? Math.max(...categorias.map((c) => c.id)) + 1 : 1;

    const nuevaCategoria = {
        id: nuevoId,
        nombre: nombreListo,
        descripcion: descripcionListo,
        activa,
    };

    categorias.push(nuevaCategoria);
    await guardarCategorias(categorias);

    return nuevaCategoria;
}

// Actualizar una categoría existente
export async function actualizarCategoria(id, datos = {}) {
    const categorias = await leerCategorias();
    const indice = categorias.findIndex((categoria) => categoria.id === id);

    if (indice === -1) {
        return null;
    }

    const { nombre, descripcion, activa } = datos;

    if (nombre !== undefined) {
        const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
        if (!nombreListo) {
            throw crearError("El nombre no puede estar vacío.", 400);
        }
        const duplicado = categorias.some(
            (categoria) =>
                categoria.id !== id &&
                normalizarTexto(categoria.nombre) === normalizarTexto(nombreListo)
        );
        if (duplicado) {
            throw crearError("Ya existe otra categoría con ese nombre.", 409);
        }
        categorias[indice].nombre = nombreListo;
    }

    if (descripcion !== undefined) {
        const descripcionLista =
            typeof descripcion === "string" ? descripcion.trim() : "";
        if (!descripcionLista) {
            throw crearError("La descripción no puede estar vacía.", 400);
        }
        categorias[indice].descripcion = descripcionLista;
    }

    if (activa !== undefined) {
        if (typeof activa !== "boolean") {
            throw crearError("El campo activa debe ser booleano.", 400);
        }
        categorias[indice].activa = activa;
    }

    await guardarCategorias(categorias);
    return categorias[indice];
}

// Eliminar físicamente una categoría
export async function eliminarCategoria(id) {
    const categorias = await obtenerCategorias();
    const indice = categorias.findIndex((categoria) => categoria.id === id);

    if (indice === -1) {
        return null;
    }

    const [eliminada] = categorias.splice(indice, 1);
    await guardarCategorias(categorias);
    return eliminada;
}



// Dar de baja lógica
export async function desactivarCategoria(id) {
    const categorias = await leerCategorias();
    const indice = categorias.findIndex((categoria) => categoria.id === id);

    if (indice === -1) {
        return null;
    }

    categorias[indice].activa = false;
    await guardarCategorias(categorias);
    return categorias[indice];
}

export default obtenerCategorias;