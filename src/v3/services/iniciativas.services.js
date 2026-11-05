import { crearServicioMongo } from "./mongo-resource.js";

const servicio = crearServicioMongo("iniciativas", {
    campos: {
        titulo: { tipo: "texto", requerido: true },
        categoria: { tipo: "texto", requerido: true },
        responsable: { tipo: "texto", requerido: true },
        activa: { tipo: "booleano", predeterminado: true },
    },
    filtros: {
        titulo: { campo: "titulo" },
        categoria: { campo: "categoria", tipo: "exacto" },
        responsable: { campo: "responsable" },
        activa: { campo: "activa", tipo: "booleano" },
    },
    campoActivo: "activa",
});

export const listaIniciativas = (filtros) => servicio.listar(filtros);
export const obtenerIniciativaId = (id) => servicio.obtenerPorId(id);
export const crearIniciativa = (datos) => servicio.crear(datos);
export const actualizarIniciativa = (id, datos) => servicio.actualizar(id, datos);
export const eliminarIniciativa = (id) => servicio.eliminar(id);
export const desactivarIniciativa = (id) => servicio.desactivar(id);

export const listar = listaIniciativas;
export const obtenerPorId = obtenerIniciativaId;
export const crear = crearIniciativa;
export const actualizar = actualizarIniciativa;
export const eliminar = eliminarIniciativa;
export const desactivar = desactivarIniciativa;
