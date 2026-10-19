import express from "express";

const app = express();
const port = 3001;
const host = "localhost";

const iniciativas = [
  { id: 1, titulo: "Campaña de reciclaje", categoria: "Sostenibilidad", responsable: "Grupo 701", activa: true },
  { id: 2, titulo: "Taller de inclusión", categoria: "Inclusión", responsable: "Grupo 701", activa: true },
  { id: 3, titulo: "Bazar de electrónicos", categoria: "Sostenibilidad", responsable: "Grupo 701", activa: true }
];

app.use(express.json());

// GET / - Confirma que la API está disponible.
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Iniciativas");
});

// GET /iniciativas - Lista todas las iniciativas.
app.get("/iniciativas", (req, res) => {
  res.json(iniciativas);
});

// GET /iniciativas/buscar?nombre=... - Filtra iniciativas por título.
app.get("/iniciativas/buscar", (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    res.json(iniciativas);
    return;
  }

  const iniciativasFiltradas = iniciativas.filter((iniciativa) =>
    iniciativa.titulo.toLowerCase().includes(String(nombre).toLowerCase())
  );

  res.json(iniciativasFiltradas);
});

// GET /iniciativas/:id - Busca una iniciativa por ID.
app.get("/iniciativas/:id", (req, res) => {
  const id = Number(req.params.id);
  const iniciativa = iniciativas.find((item) => item.id === id);

  if (iniciativa) {
    res.json(iniciativa);
    return;
  }

  res.status(404).json({ error: "Iniciativa no encontrada" });
});

// POST /iniciativas - Crea una iniciativa con los datos recibidos.
app.post("/iniciativas", (req, res) => {
  const { titulo, categoria, responsable } = req.body;

  if (!titulo || !categoria || !responsable) {
    res.status(400).json({ error: "Faltan campos obligatorios: titulo, categoria y responsable" });
    return;
  }

  const nuevaIniciativa = {
    id: iniciativas.length + 1,
    titulo,
    categoria,
    responsable,
    activa: true,
  };

  iniciativas.push(nuevaIniciativa);
  res.status(201).json(nuevaIniciativa);
});

app.listen(port, host, () => {
  console.log(`Servidor escuchando en http://${host}:${port}`);
});

// PUT /iniciativas/:id - Ruta reservada para actualizar una iniciativa.
app.put("/iniciativas/:id", (req, res) => {

});

// DELETE /iniciativas/:id - Ruta reservada para eliminar una iniciativa.
app.delete("/iniciativas/:id", (req,res)=>{

});
