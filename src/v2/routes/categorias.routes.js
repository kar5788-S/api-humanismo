import {Router} from "express";
import * as categoriasController from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", categoriasController.listar);
router.get("/:id", categoriasController.obtenerPorId);
router.post("/", categoriasController.crear);
router.put("/:id", categoriasController.actualizar);
router.delete("/:id", categoriasController.eliminar);

export default router;
