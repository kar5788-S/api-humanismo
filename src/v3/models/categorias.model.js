import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    activa: {
        type: Boolean,
        default: true,
    },
}, 
{
    collection: "categorias",
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(_document, returnedObject) {
            delete returnedObject._id;
            return returnedObject;
        },
    },
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
