import * as servicio from "../services/categorias.services.js";
import { crearControlador } from "./resource.controller.js";

export const {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    desactivar,
} = crearControlador(servicio, {
    filtros: ["nombre"],
    campoActivo: "activa",
    nombreRecurso: "Categoría",
    respuestaLista: (categorias) => ({
        noCategorias: categorias.length,
        datos: categorias,
    }),
});
