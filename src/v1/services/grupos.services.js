// Servicio: módulo que concentra operaciones y reglas de negocio
// para el recurso de grupos. Lee y escribe en data/grupos.json.

import { readFile, writeFile } from "node:fs/promises";

const rutaGrupos = new URL("../data/grupos.json", import.meta.url);

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

// Lectura y escritura del archivo.

async function leerGrupos() {
    const contenido = await readFile(rutaGrupos, "utf8");
    return JSON.parse(contenido);
}

async function guardarGrupos(grupos) {
    await writeFile(rutaGrupos, JSON.stringify(grupos, null, 2), "utf8");
    return grupos;
}

// Operaciones del recurso.

// Devuelve todos los grupos sin aplicar filtros.
export async function obtenerGrupos() {
    return await leerGrupos();
}

// Lista grupos y aplica los filtros opcionales recibidos.
export async function listaGrupos({ nombre, turno, activo } = {}) {
    let grupos = await leerGrupos();

    if (typeof nombre === "string" && nombre.trim() !== "") {
        grupos = grupos.filter((g) =>
            normalizarTexto(g.nombre).includes(normalizarTexto(nombre))
        );
    }

    if (typeof turno === "string" && turno.trim() !== "") {
        grupos = grupos.filter(
            (g) => normalizarTexto(g.turno) === normalizarTexto(turno)
        );
    }

    if (typeof activo === "boolean") {
        grupos = grupos.filter((g) => g.activo === activo);
    }

    return grupos;
}

// Busca un grupo por ID y devuelve null si no existe.
export async function obtenerGrupoId(id) {
    const grupos = await leerGrupos();
    return grupos.find((g) => g.id === id) ?? null;
}

// Valida y guarda un grupo nuevo.
export async function crearGrupo({ nombre, grado, grupo, turno, activo = true } = {}) {
    const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
    if (!nombreListo) {
        throw crearError("El nombre del grupo es obligatorio.", 400);
    }

    if (!Number.isInteger(grado) || grado < 1) {
        throw crearError("El grado debe ser un entero positivo.", 400);
    }

    const grupoListo = typeof grupo === "string" ? grupo.trim() : "";
    if (!grupoListo) {
        throw crearError("El campo grupo es obligatorio.", 400);
    }

    const turnoListo = typeof turno === "string" ? turno.trim() : "";
    if (!turnoListo) {
        throw crearError("El turno es obligatorio.", 400);
    }

    if (typeof activo !== "boolean") {
        throw crearError("El campo activo debe ser booleano.", 400);
    }

    const grupos = await leerGrupos();

    const existe = grupos.some(
        (g) => normalizarTexto(g.nombre) === normalizarTexto(nombreListo)
    );
    if (existe) {
        throw crearError("Ya existe un grupo con ese nombre.", 409);
    }

    const nuevoId =
        grupos.length > 0 ? Math.max(...grupos.map((g) => g.id)) + 1 : 1;

    const nuevoGrupo = {
        id: nuevoId,
        nombre: nombreListo,
        grado,
        grupo: grupoListo,
        turno: turnoListo,
        activo,
    };

    grupos.push(nuevoGrupo);
    await guardarGrupos(grupos);

    return nuevoGrupo;
}

// Actualiza los campos proporcionados de un grupo existente.
export async function actualizarGrupo(id, datos = {}) {
    const grupos = await leerGrupos();
    const indice = grupos.findIndex((g) => g.id === id);

    if (indice === -1) {
        return null;
    }

    const { nombre, grado, grupo, turno, activo } = datos;

    if (nombre !== undefined) {
        const nombreListo = typeof nombre === "string" ? nombre.trim() : "";
        if (!nombreListo) {
            throw crearError("El nombre no puede estar vacío.", 400);
        }
        const duplicado = grupos.some(
            (g) =>
                g.id !== id &&
                normalizarTexto(g.nombre) === normalizarTexto(nombreListo)
        );
        if (duplicado) {
            throw crearError("Ya existe otro grupo con ese nombre.", 409);
        }
        grupos[indice].nombre = nombreListo;
    }

    if (grado !== undefined) {
        if (!Number.isInteger(grado) || grado < 1) {
            throw crearError("El grado debe ser un entero positivo.", 400);
        }
        grupos[indice].grado = grado;
    }

    if (grupo !== undefined) {
        const grupoListo = typeof grupo === "string" ? grupo.trim() : "";
        if (!grupoListo) {
            throw crearError("El campo grupo no puede estar vacío.", 400);
        }
        grupos[indice].grupo = grupoListo;
    }

    if (turno !== undefined) {
        const turnoListo = typeof turno === "string" ? turno.trim() : "";
        if (!turnoListo) {
            throw crearError("El turno no puede estar vacío.", 400);
        }
        grupos[indice].turno = turnoListo;
    }

    if (activo !== undefined) {
        if (typeof activo !== "boolean") {
            throw crearError("El campo activo debe ser booleano.", 400);
        }
        grupos[indice].activo = activo;
    }

    await guardarGrupos(grupos);
    return grupos[indice];
}

// Elimina físicamente un grupo.
export async function eliminarGrupo(id) {
    const grupos = await leerGrupos();
    const indice = grupos.findIndex((g) => g.id === id);

    if (indice === -1) {
        return null;
    }

    const [eliminado] = grupos.splice(indice, 1);
    await guardarGrupos(grupos);
    return eliminado;
}

// Desactiva un grupo sin eliminarlo del archivo.
export async function desactivarGrupo(id) {
    const grupos = await leerGrupos();
    const indice = grupos.findIndex((g) => g.id === id);

    if (indice === -1) {
        return null;
    }

    grupos[indice].activo = false;
    await guardarGrupos(grupos);
    return grupos[indice];
}

export default obtenerGrupos;