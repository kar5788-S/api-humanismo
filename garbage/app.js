
import * as crudIniciativas from '../iniciativas.js';

const nombre = "Proyecto de Humanismo";
const responsable = "Estudiantes ISC";
const categoria = "Sostenibilidad";

console.log("Proyecto: ", nombre);
console.log("Responsable: ", responsable);
console.log("Categoria: ", categoria);

const iniciativa = {
    titulo : "Reciclaje de residuos electrónicos",
    categoria : "Sostenibilidad",
    responsable : "G1VSIS07",
    activa : true
}

console.log(iniciativa);

function mostrarIniciativa(iniciativa){
    console.log("Titulo: ", iniciativa.titulo);
    console.log("Responsable: ", iniciativa.responsable);
    console.log("Categoria: ", iniciativa.categoria);
}

mostrarIniciativa(iniciativa);

// Crear nueva iniciativa
const iniciativa2 = crudIniciativas.crearIniciativa("Huerto Comunitario", "Sostenibilidad", "Grupo G1VSIS07");
console.log("\nNueva iniciativa creada");
console.log(iniciativa2);

// USO DE CALLBACKS
crudIniciativas.mostrarIniciativas((datos) => {
    console.log("\nIniciativas recibidas con Callback (Espera 2 seg): ");
    console.log(datos);
});

// USO DE PROMESAS
crudIniciativas.mostrarIniciativas2()
    .then((datos) => {
        console.log("\nIniciativas recibidas con Promesa (Espera 2 seg):");
        console.log(datos);
    })
    .catch((error) => {
        console.error("Error al obtener iniciativas: ", error);
    });

// USO DE ASYNC/AWAIT
async function mostrarI(){
    try {
        const datos = await crudIniciativas.mostrarIniciativas2();
        console.log("\nFunción Async/Await ejecutada exitosamente");
        console.log(datos);
    }
    catch (error) {
        console.log('Error: ', error);
    }
}
mostrarI();

// BÚSQUEDA POR CATEGORÍA
console.log("\nBúsqueda Exitosa (Sostenibilidad)");
const resultadoSostenibilidad = crudIniciativas.buscarporCategoria("Sostenibilidad");
console.log(resultadoSostenibilidad);

console.log("\nBúsqueda con categoría no permitida (Finanzas)");
const resultadoInvalido = crudIniciativas.buscarporCategoria("Finanzas");
console.log(resultadoInvalido);

// Busca iniciativa por Id
console.log('\nBuscar por ID (ID: 3)');
console.log(crudIniciativas.buscarIniciativaId(3));

// Busca iniciativa por Id mediante promesa
crudIniciativas.buscarIniciativaPromesa(4)
    .then((iniciativa) => {
        console.log('\nBuscar por ID con Promesa (Espera 0.5 seg)');
        console.log(iniciativa);
    })
    .catch((error) => console.error(error.message));

// Busca iniciativa por Id Async/Await
(async () => {
    try {
        const iniciativa = await crudIniciativas.buscarIniciativaAsyc(5);
        console.log('\nBuscar por ID con Async/Await');
        console.log(iniciativa);
    } catch (error) {
        console.error(error.message);
    }
})();

// Agrega una iniciativa
console.log('\nAgregar Iniciativa');
const nuevaIniciativa = crudIniciativas.crearIniciativa(
    "Desarrollo de API REST", 
    "Sostenibilidad", 
    "Karol Salvador"
);
console.log(nuevaIniciativa);

// Actualizar la iniciativa agregada previamente
console.log('\nActualizar Iniciativa');
const iniciativaActualizada = crudIniciativas.actualizarIniciativa(
    nuevaIniciativa.id, 
    { titulo: "Desarrollo de API REST y App Móvil" }
);
console.log(iniciativaActualizada);

// Desactiva la iniciativa agregada previamente
console.log('\nDesactivar Iniciativa');
crudIniciativas.desactivarIniciativa(nuevaIniciativa.id);
console.log(`Iniciativa con ID ${nuevaIniciativa.id} desactivada exitosamente.`);

// Busca la iniciativa por Id, desactivada previamente
console.log('\nBuscar Iniciativa Desactivada');
console.log(crudIniciativas.buscarIniciativaId(nuevaIniciativa.id));

// Elimina la iniciativa agregada previamente.
console.log('\nEliminar Iniciativa');
const iniciativaEliminada = crudIniciativas.eliminarIniciativa(nuevaIniciativa.id);
console.log('Iniciativa eliminada de la memoria:', iniciativaEliminada);