import * as servicio from "../services/iniciativas.services.js";
import { crearControlador } from "./resource.controller.js";

export const {
    listar,
    buscarPorCategoria,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    desactivar,
} = crearControlador(servicio, {
    filtros: ["titulo", "categoria", "responsable"],
    campoActivo: "activa",
    nombreRecurso: "Iniciativa",
});
