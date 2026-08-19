const { randomUUID } = require("crypto");
const manipatacion = require("./manipulacionData");
const juego = require("./logicaJuego");

const total_Rondas = 6;

// Función que vamos a usar para evitar que se muestre la palabra al jugador que la tiene que adivinar
function partidaParaJugador(partida) {
  const copia = JSON.parse(JSON.stringify(partida));

  copia.ronda = copia.rondas.map((ronda) => {
    if (!ronda.finalizada) {
      const { palabraSecreta, ...rondaSinPalabra } = ronda;
      return { ...rondaSinPalabra, longitud: palabraSecreta.length };
    }
    return ronda;
  });
  return copia;
}

// Función para crear la ronda
function crearRonda(numero, jugadorAdivina) {
  return {
    numero,
    jugadorAdivina,
    palabraSecreta: juego.elegirPalabraAleatoria(),
    intentos: [],
    finalizado: false,
    inicioTimepo: Date.now(),
    tiempoSegundos: null,
  };
}

// Función para la cración de la partida
function crearPartida(req, res) {
  const { nombreJugador1, nombreJugador2 } = req.body;

  if (!nombreJugador1 || !nombreJugador2) {
    return res.status(400).json({ error: "Nombres de jugadores inválidos" });
  }
  const { jugador1, jugador2 } = juego.elegirJugador(
    nombreJugador1,
    nombreJugador2,
  );
  const partida = {
    id: randomUUID(),
    jugador1,
    jugador2,
    fecha: new Date().toISOString(),
    estado: "en curso",
    rondaActual: 1,
    rondas: [crearRonda(1, jugador1)],
    resumen: null,
  };
  manipatacion.crearPartida(partida);
  res.status(201).json(partidaParaJugador(partida));
}

// Función para poder registrar el intento de un jugador en la partida
function registrarIntento(req, res) {
  const { idPartida } = req.params;
  const { intento } = req.body;

  const partida = manipatacion.buscarPartidaPorId(idPartida);
  if (!partida) {
    return res.status(404).json({ error: "Partida no encontrada" });
  }
  if (partida.estado === "finalizada") {
    return res.status(400).json({ error: "Partida finalizada" });
  }

  const ronda = partida.rondas[partida.rondaActual - 1];
  if (ronda.finalizada) {
    return res.status(400).json({ error: "Ronda finalizada" });
  }

  const resultado = juego.compararIntento(ronda.palabraSecreta, intento);
  if (!resultado.longitudValida) {
    return res.status(400).json({
      error:
        "El intento tiene una longitud inválida de " +
        ronda.palabraSecreta.length +
        " caracteres",
    });
  }
  const pista = resultado.esCorrecto
    ? "¡Correcto!"
    : juego.darPistas(resultado.posicionesCorrectas);

  ronda.intentos.push({
    palabra: intento.toLowerCase(),
    pista,
    tiempo: Date.now() - ronda.inicioTimepo,
  });

  let partidaFinalizada = false;

  if (resultado.esCorrecto) {
    ronda.finalizado = true;
    ronda.tiempoSegundos = Math.round((Date.now() - ronda.inicioTimepo) / 1000);

    if (partida.rondaActual >= total_Rondas) {
      partida.resumen = juego.infoPartida(
        partida.rondas,
        partida.jugador1,
        partida.jugador2,
      );
      partida.estado = "finalizada";
      partidaFinalizada = true;
    }
  }

  manipatacion.actualizarPartida(idPartida, partida);

  res.json({
    esCorrecto: resultado.esCorrecto,
    pista,
    partida: partidaParaJugador(partida),
    partidaFinalizada,
  });
}

// Función para cambiar de ronda en la partida
function cambiarRonda(req, res) {
  const { id } = req.params;
  const partida = manipatacion.buscarPartidaPorId(id);

  if (!partida) {
    return res.status(404).json({ error: "Partida no encontrada" });
  }
  if (partida.estado === "finalizada") {
    return res.status(400).json({ error: "Partida finalizada" });
  }

  const rondaAnterior = partida.rondas[partida.rondaActual - 1];

  if (!rondaAnterior.finalizado) {
    return res.status(400).json({ error: "La ronda actual no ha finalizado" });
  }
  if (partida.rondaActual >= total_Rondas) {
    return res.status(400).json({ error: "No hay más rondas disponibles" });
  }

  const siguienteJugadorAdivina =
    rondaAnterior.jugadorAdivina === partida.jugador1
      ? partida.jugador2
      : partida.jugador1;

  partida.rondaActual += 1;
  partida.rondas.push(crearRonda(partida.rondaActual, siguienteJugadorAdivina));

  manipatacion.actualizarPartida(id, partida);

  res.json(partidaParaJugador(partida));
}

function obtenerHistorial(req, res) {
  const partidas = manipatacion.leerArchivo();
  res.json(partidas.map(partidaParaJugador));
}

function obtenerDetalles(req, res) {
  const { id } = req.params;
  const partida = manipatacion.buscarPartidaPorId(id);

  if (!partida) {
    return res.status(404).json({ error: "Partida no encontrada" });
  }
  res.json(partidaParaJugador(partida));
}

module.exports = {
  crearPartida,
  registrarIntento,
  cambiarRonda,
  obtenerHistorial,
  obtenerDetalles,
};
