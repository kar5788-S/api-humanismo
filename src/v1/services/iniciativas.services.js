import { readFile, writeFile } from "node:fs/promises";

const rutaIniciativas = new URL("../data/iniciativas.json", import.meta.url);

// Crea errores con un código HTTP para que la capa controladora los responda.
function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

// Normaliza texto para comparar sin distinguir acentos ni mayúsculas.
function normalizarTexto(valor = "") {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es-MX")
        .trim();
}

// Lee las iniciativas almacenadas en el archivo JSON.
async function leerIniciativas() {
    const contenido = await readFile(rutaIniciativas, "utf8");
    return JSON.parse(contenido);
}

// Persiste el listado actualizado de iniciativas en el archivo JSON.
async function guardarIniciativas(iniciativas) {
    await writeFile(rutaIniciativas, JSON.stringify(iniciativas, null, 2), "utf8");
    return iniciativas;
}

// Devuelve todas las iniciativas sin aplicar filtros.
export async function obtenerIniciativas() {
    return leerIniciativas();
}

// Lista iniciativas y aplica los filtros opcionales recibidos.
export async function listaIniciativas({ titulo, categoria, responsable, activa } = {}) {
    let iniciativas = await leerIniciativas();

    if (typeof titulo === "string" && titulo.trim()) {
        iniciativas = iniciativas.filter((iniciativa) =>
            normalizarTexto(iniciativa.titulo).includes(normalizarTexto(titulo))
        );
    }
    if (typeof categoria === "string" && categoria.trim()) {
        iniciativas = iniciativas.filter(
            (iniciativa) =>
                normalizarTexto(iniciativa.categoria) === normalizarTexto(categoria)
        );
    }
    if (typeof responsable === "string" && responsable.trim()) {
        iniciativas = iniciativas.filter((iniciativa) =>
            normalizarTexto(iniciativa.responsable).includes(normalizarTexto(responsable))
        );
    }
    if (typeof activa === "boolean") {
        iniciativas = iniciativas.filter((iniciativa) => iniciativa.activa === activa);
    }

    return iniciativas;
}

// Busca una iniciativa por ID y devuelve null si no existe.
export async function obtenerIniciativaId(id) {
    const iniciativas = await leerIniciativas();
    return iniciativas.find((iniciativa) => iniciativa.id === id) ?? null;
}

// Valida y guarda una iniciativa nueva.
export async function crearIniciativa({ titulo, categoria, responsable, activa = true } = {}) {
    const tituloListo = typeof titulo === "string" ? titulo.trim() : "";
    const categoriaLista = typeof categoria === "string" ? categoria.trim() : "";
    const responsableListo = typeof responsable === "string" ? responsable.trim() : "";

    if (!tituloListo || !categoriaLista || !responsableListo) {
        throw crearError(
            "titulo, categoria y responsable son obligatorios y deben ser textos no vacíos.",
            400
        );
    }
    if (typeof activa !== "boolean") {
        throw crearError("activa debe ser un valor booleano.", 400);
    }

    const iniciativas = await leerIniciativas();
    const nuevoId = iniciativas.length > 0
        ? Math.max(...iniciativas.map((iniciativa) => iniciativa.id)) + 1
        : 1;
    const nuevaIniciativa = {
        id: nuevoId,
        titulo: tituloListo,
        categoria: categoriaLista,
        responsable: responsableListo,
        activa,
    };

    iniciativas.push(nuevaIniciativa);
    await guardarIniciativas(iniciativas);
    return nuevaIniciativa;
}

// Actualiza los campos proporcionados de una iniciativa existente.
export async function actualizarIniciativa(id, datos = {}) {
    const iniciativas = await leerIniciativas();
    const indice = iniciativas.findIndex((iniciativa) => iniciativa.id === id);
    if (indice === -1) {
        return null;
    }

    const { titulo, categoria, responsable, activa } = datos;
    for (const [campo, valor] of Object.entries({ titulo, categoria, responsable })) {
        if (valor !== undefined) {
            if (typeof valor !== "string" || !valor.trim()) {
                throw crearError(`${campo} debe ser un texto no vacío.`, 400);
            }
            iniciativas[indice][campo] = valor.trim();
        }
    }
    if (activa !== undefined) {
        if (typeof activa !== "boolean") {
            throw crearError("activa debe ser un valor booleano.", 400);
        }
        iniciativas[indice].activa = activa;
    }

    await guardarIniciativas(iniciativas);
    return iniciativas[indice];
}

// Elimina físicamente una iniciativa.
export async function eliminarIniciativa(id) {
    const iniciativas = await leerIniciativas();
    const indice = iniciativas.findIndex((iniciativa) => iniciativa.id === id);
    if (indice === -1) {
        return null;
    }

    const [eliminada] = iniciativas.splice(indice, 1);
    await guardarIniciativas(iniciativas);
    return eliminada;
}

// Desactiva una iniciativa sin eliminarla del archivo.
export async function desactivarIniciativa(id) {
    const iniciativas = await leerIniciativas();
    const iniciativa = iniciativas.find((item) => item.id === id);
    if (!iniciativa) {
        return null;
    }

    iniciativa.activa = false;
    await guardarIniciativas(iniciativas);
    return iniciativa;
}

export default obtenerIniciativas;
