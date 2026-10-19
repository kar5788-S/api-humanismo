import { Router } from "express";
import * as iniciativasController from "../controllers/iniciativas.controller.js";

const router = Router();

router.get("/", iniciativasController.listar);
router.get("/buscar", iniciativasController.buscarPorCategoria);
router.get("/:id", iniciativasController.obtenerPorId);
router.post("/", iniciativasController.crear);
router.put("/:id", iniciativasController.actualizar);
router.patch("/:id/desactivar", iniciativasController.desactivar);
router.delete("/:id", iniciativasController.eliminar);

export default router;
