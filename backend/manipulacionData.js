const fs = require("fs");
const path = require("path");

const ArchivoPartidas = path.join(__dirname, "data", "partidas.json");

// Así podremos leer el archivo JSON y devolver su contenido como un objeto
function leerArchivo() {
  try {
    const data = fs.readFileSync(ArchivoPartidas, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
}

// Guardamos los datos en el archivo JSON
function guardarArchivo(partidas) {
  try {
    fs.writeFileSync(
      ArchivoPartidas,
      JSON.stringify(partidas, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
  }
}

// Buscamos partidas por si id
function buscarPartidaPorId(id) {
  const partidas = leerArchivo();
  return partidas.find((partida) => partida.id === id);
}

// Agregar una nueva partida al archivo JSON
function crearPartida(partida) {
  const partidas = leerArchivo();
  partidas.push(partida);
  guardarArchivo(partidas);
  return partida;
}

// Actualizamos alguna partida
function actualizarPartida(id, nuevaPartida) {
  const partidas = leerArchivo();
  const indice = partidas.findIndex((partida) => partida.id === id);

  if (indice === -1) {
    return null;
  }

  partidas[indice] = { ...partidas[indice], ...nuevaPartida };
  guardarArchivo(partidas);
  return partidas[indice];
}

module.exports = {
  leerArchivo,
  guardarArchivo,
  buscarPartidaPorId,
  crearPartida,
  actualizarPartida,
};
