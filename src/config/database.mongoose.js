import mongoose from 'mongoose';

let connectionPromise;

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    if (connectionPromise) {
        return connectionPromise;
    }

    const uri = process.env.MONGODB_URI2 || process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI2 o MONGODB_URI debe estar configurada.');
    }

    const options = process.env.MONGODB_NAME
        ? { dbName: process.env.MONGODB_NAME }
        : {};

    connectionPromise = mongoose.connect(uri, options)
        .then(() => mongoose.connection)
        .catch(async (error) => {
            connectionPromise = undefined;
            if (mongoose.connection.readyState !== 0) {
                await mongoose.disconnect();
            }
            console.error('Error al conectar a Mongoose:', error);
            throw error;
        });

    return connectionPromise;
}
