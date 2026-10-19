// Crea una iniciativa y la agrega a la lista en memoria.
function crearIniciativa(titulo, categoria, responsable) {
  const nuevoId =
    iniciativas.length > 0 ? Math.max(...iniciativas.map((i) => i.id)) + 1 : 1;

  const nuevaIniciativa = {
    id: nuevoId,
    titulo,
    categoria,
    responsable,
    activa: true,
  };

  iniciativas.push(nuevaIniciativa);
  return nuevaIniciativa;
}

const iniciativas = [
  { id: 1, titulo: "Campaña de reciclaje", categoria: "Sostenibilidad", responsable: "Grupo 701", activa: true },
  { id: 2, titulo: "Taller de inclusión", categoria: "Inclusión", responsable: "Grupo 701", activa: true },
  { id: 3, titulo: "Bazar de electrónicos", categoria: "Sostenibilidad", responsable: "Grupo 701", activa: true },
  { id: 4, titulo: "Taller de accesibilidad digital", categoria: "Inclusión", responsable: "Grupo 702", activa: true },
  { id: 5, titulo: "Campaña de reciclaje electrónico", categoria: "Sostenibilidad", responsable: "Grupo 702", activa: true },
  { id: 6, titulo: "Feria de Cultura Regional", categoria: "Cultura", responsable: "Grupo 703", activa: true },
  { id: 7, titulo: "Programa de Apoyo Comunitario", categoria: "Conciencia Social", responsable: "Grupo 703", activa: true },
  { id: 8, titulo: "Huerto Escolar", categoria: "Sostenibilidad", responsable: "Grupo 704", activa: true },
  { id: 9, titulo: "Foro de Patrimonio Local", categoria: "Cultura", responsable: "Grupo 704", activa: true },
  { id: 10, titulo: "Curso de Lengua de Señas", categoria: "Inclusión", responsable: "Grupo 704", activa: true },
];

// Entrega la lista de iniciativas mediante un callback.
function mostrarIniciativas(callback) {
  setTimeout(() => {
    callback(iniciativas);
  }, 2000);
}

// Entrega la lista de iniciativas mediante una promesa.
function mostrarIniciativas2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(iniciativas);
    }, 2000);
  });
}

// Busca iniciativas por una categoría permitida.
function buscarporCategoria(categoria) {
  const categoriasPermitidas = [
    "Inclusión",
    "Sostenibilidad",
    "Cultura",
    "Conciencia Social",
  ];

  const categoriaNormalizada = categoria.trim().toLowerCase();
  const categoriaValida = categoriasPermitidas.some(
    (item) => item.toLowerCase() === categoriaNormalizada,
  );

  if (!categoriaValida) {
    return [];
  }

  return iniciativas.filter(
    (iniciativa) => iniciativa.categoria.toLowerCase() === categoriaNormalizada,
  );
}

// Busca una iniciativa por ID.
function buscarIniciativaId(id) {
  return iniciativas.find((iniciativa) => iniciativa.id === id);
}

// Actualiza los datos de una iniciativa existente.
function actualizarIniciativa(id, datos) {
  const indice = iniciativas.findIndex((iniciativa) => iniciativa.id === id);

  if (indice === -1) {
    return null;
  }

  iniciativas[indice] = {
    ...iniciativas[indice],
    ...datos,
    id: iniciativas[indice].id,
  };

  return iniciativas[indice];
}

// Elimina una iniciativa de la lista en memoria.
function eliminarIniciativa(id) {
  const indice = iniciativas.findIndex((iniciativa) => iniciativa.id === id);

  if (indice === -1) {
    return null;
  }

  const eliminada = iniciativas.splice(indice, 1);

  return eliminada[0];
}

// Desactiva una iniciativa sin eliminarla de la lista.
function desactivarIniciativa(id) {
  const indice = iniciativas.findIndex((iniciativa) => iniciativa.id === id);

  if (indice === -1) {
    return null;
  }

  iniciativas[indice].activa = false; 

  return true;
}

// Busca una iniciativa por ID y resuelve o rechaza una promesa.
function buscarIniciativaPromesa(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const iniciativa = iniciativas.find((iniciativa) => iniciativa.id === id);

      if (!iniciativa) {
        reject(new Error("Iniciativa no encontrada"));
        return;
      }

      resolve(iniciativa);
    }, 500);
  });
}

// Busca una iniciativa por ID y lanza un error si no existe.
async function buscarIniciativaAsyc(id) {
  const iniciativa = iniciativas.find((iniciativa) => iniciativa.id === id);

  if(!iniciativa){
    throw new Error("Iniciativa no encontrada"); 
  }
  return iniciativa;   
}

export {
  crearIniciativa,
  mostrarIniciativas,
  mostrarIniciativas2,
  buscarporCategoria,
  buscarIniciativaId,
  actualizarIniciativa,
  eliminarIniciativa,
  desactivarIniciativa,
  buscarIniciativaPromesa,
  buscarIniciativaAsyc
};
