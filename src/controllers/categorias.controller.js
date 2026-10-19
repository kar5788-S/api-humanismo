import * as categoriasService from '../services/categorias.services.js';

// GET /api/categorias
// Aplicar o admitir los filtros ?nombre=cultura&activa=true/false
export async function listar(req, res, next) {
    try {
        const nombre = typeof req.query.nombre === 'string' ? req.query.nombre.trim() : undefined;
        let activa;
        if (req.query.activa !== undefined) {
            if (req.query.activa !== "true" && req.query.activa !== "false") {
                return res.status(400).json({ mensaje: "El valor de 'activa' debe ser 'true' o 'false'" });
            }
            activa = req.query.activa === "true";
        }
        const resultado = await categoriasService.listaCategorias({ nombre, activa });
        return res.status(200).json({
            noCategorias: resultado.length,
            datos: resultado
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/categorias/:id
export async function obtenerPorId(req, res, next) {
    try {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID de la categoría debe ser un número entero positivo." });
        }
        const categoria = await categoriasService.obtenerCategoriaId(id);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json(categoria);
    } catch (err) {
        return next(err);
    }
}

function convertirId(valor){
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// POST /api/categorias
export async function crear(req, res, next) {
    try {
        const { nombre, descripcion, activa } = req.body ?? {};
        if(typeof nombre !== 'string' || nombre.trim() === ''){
            return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio y no puede estar vacío." });
        }
        if(typeof descripcion !== 'string' || descripcion.trim() === ''){
            return res.status(400).json({ mensaje: "La descripción de la categoría es obligatoria y no puede estar vacía." });
        }
        if(typeof activa !== 'boolean'){
            return res.status(400).json({ mensaje: "El campo 'activa' es obligatorio y debe ser un valor booleano." });
        }
        const nuevaCategoria = await categoriasService.crearCategoria({ nombre, descripcion, activa });
        return res.status(201).json(nuevaCategoria);
    } catch (err) {
        next(err);
    }
}

// PUT /api/categorias/:id
// PUT recibir la representación completa: nombre, descripcion, activa
export async function actualizar(req, res, next) {
    try{
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID de la categoría debe ser un número entero positivo." });
        }
        const { nombre, descripcion, activa } = req.body ?? {};
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio y no puede estar vacío." });
        }
        if (typeof descripcion !== 'string' || descripcion.trim() === '') {
            return res.status(400).json({ mensaje: "La descripción de la categoría es obligatoria y no puede estar vacía." });
        }
        if (typeof activa !== 'boolean') {
            return res.status(400).json({ mensaje: "El campo 'activa' es obligatorio y debe ser un valor booleano." });
        }
        const categoriaActualizada = await categoriasService.actualizarCategoria(id, { nombre, descripcion, activa });
        if (!categoriaActualizada) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json(categoriaActualizada);
    }catch(err){
        return next(err);
    }
}

// DELETE /api/categorias/:id
export async function eliminar(req, res, next) {
    try {
        const id = convertirId(req.params.id);
        if (id === null) {
            return res.status(400).json({ mensaje: "El ID de la categoría debe ser un número entero positivo." });
        }
        const categoriaEliminada = await categoriasService.eliminarCategoria(id);
        if (!categoriaEliminada) {
            return res.status(404).json({ mensaje: "Categoría no encontrada." });
        }
        return res.status(200).json({ mensaje: "Categoría eliminada correctamente." , datos : categoriaEliminada});
    } catch (err) {
        return next(err);
    }
}