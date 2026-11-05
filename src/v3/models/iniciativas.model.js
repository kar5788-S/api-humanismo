import mongoose from "mongoose";

const iniciativaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
    },
    responsable: {
        type: String,
        required: true,
        trim: true,
    },
    activa: {
        type: Boolean,
        default: true,
    },
}, {
    collection: "iniciativas",
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(_document, returnedObject) {
            delete returnedObject._id;
            return returnedObject;
        },
    },
});

export default mongoose.model("Iniciativa", iniciativaSchema);
