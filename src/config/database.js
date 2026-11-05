import { MongoClient } from "mongodb";

let client;
let database;
let connectionPromise;

export async function connectDB() {
    if (database) {
        return database;
    }
    if (connectionPromise) {
        return connectionPromise;
    }

    const { MONGODB_URI: uri, MONGODB_NAME: databaseName } = process.env;
    if (!uri || !databaseName) {
        throw new Error("MONGODB_URI y MONGODB_NAME deben estar configurados.");
    }

    client = new MongoClient(uri);
    connectionPromise = client.connect()
        .then((connectedClient) => {
            database = connectedClient.db(databaseName);
            return database;
        })
        .catch(async (error) => {
            await client.close();
            client = undefined;
            connectionPromise = undefined;
            throw error;
        });

    return connectionPromise;
}

export function getDB() {
    if (!database) {
        throw new Error("La conexión a MongoDB aún no está inicializada.");
    }
    return database;
}