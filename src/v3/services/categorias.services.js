import { crearServicioMongo } from "./mongo-resource.js";

const servicio = crearServicioMongo("categorias", {
    campos: {
        nombre: { tipo: "texto", requerido: true },
        descripcion: { tipo: "texto", requerido: true },
        activa: { tipo: "booleano", predeterminado: true },
    },
    filtros: {
        nombre: { campo: "nombre" },
        activa: { campo: "activa", tipo: "booleano" },
    },
    campoActivo: "activa",
    campoUnico: "nombre",
});

export const listaCategorias = (filtros) => servicio.listar(filtros);
export const obtenerCategoriaId = (id) => servicio.obtenerPorId(id);
export const crearCategoria = (datos) => servicio.crear(datos);
export const actualizarCategoria = (id, datos) => servicio.actualizar(id, datos);
export const eliminarCategoria = (id) => servicio.eliminar(id);
export const desactivarCategoria = (id) => servicio.desactivar(id);

export const listar = listaCategorias;
export const obtenerPorId = obtenerCategoriaId;
export const crear = crearCategoria;
export const actualizar = actualizarCategoria;
export const eliminar = eliminarCategoria;
export const desactivar = desactivarCategoria;
