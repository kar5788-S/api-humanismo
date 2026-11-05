import { crearServicioMongo } from "./mongo-resource.js";

const servicio = crearServicioMongo("grupos", {
    campos: {
        nombre: { tipo: "texto", requerido: true },
        grado: { tipo: "entero", requerido: true },
        grupo: { tipo: "texto", requerido: true },
        turno: { tipo: "texto", requerido: true },
        activo: { tipo: "booleano", predeterminado: true },
    },
    filtros: {
        nombre: { campo: "nombre" },
        turno: { campo: "turno", tipo: "exacto" },
        activo: { campo: "activo", tipo: "booleano" },
    },
    campoActivo: "activo",
    campoUnico: "nombre",
});

export const listaGrupos = (filtros) => servicio.listar(filtros);
export const obtenerGrupoId = (id) => servicio.obtenerPorId(id);
export const crearGrupo = (datos) => servicio.crear(datos);
export const actualizarGrupo = (id, datos) => servicio.actualizar(id, datos);
export const eliminarGrupo = (id) => servicio.eliminar(id);
export const desactivarGrupo = (id) => servicio.desactivar(id);

export const listar = listaGrupos;
export const obtenerPorId = obtenerGrupoId;
export const crear = crearGrupo;
export const actualizar = actualizarGrupo;
export const eliminar = eliminarGrupo;
export const desactivar = desactivarGrupo;
