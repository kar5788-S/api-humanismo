import mongoose from "mongoose";

const grupoSchema = new mongoose.Schema({
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
    grado: {
        type: Number,
        required: true,
        min: 1,
    },
    grupo: {
        type: String,
        required: true,
        trim: true,
    },
    turno: {
        type: String,
        required: true,
        trim: true,
    },
    activo: {
        type: Boolean,
        default: true,
    },
}, {
    collection: "grupos",
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(_document, returnedObject) {
            delete returnedObject._id;
            return returnedObject;
        },
    },
});

export default mongoose.model("Grupo", grupoSchema);
