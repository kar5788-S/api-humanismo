import * as servicio from "../services/grupos.services.js";
import { crearControlador } from "./resource.controller.js";

export const {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    desactivar,
} = crearControlador(servicio, {
    filtros: ["nombre", "turno"],
    campoActivo: "activo",
    nombreRecurso: "Grupo",
});
