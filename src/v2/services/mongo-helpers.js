export function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

export function textoRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function calcularSiguienteId(coleccion) {
    const ultimo = await coleccion.find({}, { projection: { id: 1 } })
        .sort({ id: -1 })
        .limit(1)
        .next();
    return Number.isInteger(ultimo?.id) ? ultimo.id + 1 : 1;
}
