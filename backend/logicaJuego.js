// Creamos una lsita de palabras para el juego

const LISTA_PALABRAS = [
  "Mesa",
  "Flor",
  "Lapizlasuli",
  "Computación",
  "Desfile",
  "Parque",
  "Juego",
  "Lenguaje",
  "Programación",
  "JavaScript",
  "Python",
  "Java",
  "Baño",
  "Probabilidades",
  "Seminario",
  "Ciencia",
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Berna",
  "Toronto",
  "Montevideo",
  "Heredia",
  "Limón",
  "Cartago",
  "Alajuela",
  "San José",
  "Puntarenas",
  "Guanacaste",
  "Nicoya",
];

// Función para elegir uana palabra aleatoria de la lista
function elegirPalabraAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * LISTA_PALABRAS.length);
  return LISTA_PALABRAS[indiceAleatorio];
}

function validarPalabra(palabra) {
  const limpia = (palabra || "").trim().toLowerCase();

  if (limpia.length < 4 || limpia.length > 8) {
    return {
      valida: false,
      error: "La palabra debe de tener entre 4 y 8 caracteres.",
    };
  }

  if (!/^[a-záéíóúñ]+$/.test(limpia)) {
    return { valida: false, error: "La palabra solo puede contener letras." };
  }
  return { valida: true, error: null };
}

// Función para elegir la posición de los jugadores
function elegirJugador(nombreA, nombreB) {
  const primero = Math.random() < 0.5;
  return primero
    ? { jugador1: nombreA, jugador2: nombreB }
    : { jugador1: nombreB, jugador2: nombreA };
}

// Función para comparar el intento en curso con la palabra secreta,
// se verifica si las letras fueron acertadas o no
function compararIntento(palabraSecreta, intento) {
  const secreta = palabraSecreta.toLowerCase();
  const propuesta = (intento || "").toLowerCase(); // Por si dan vavcio

  if (propuesta.length !== secreta.length) {
    return {
      longitudValida: false,
      esCorrecto: false,
      posicionesCorrectas: [],
    };
  }

  const posicionesCorrectas = [];
  for (let i = 0; i < secreta.length; i++) {
    if (secreta[i] === propuesta[i]) {
      posicionesCorrectas.push(i + 1);
    }
  }
  return {
    longitudValida: true,
    esCorrecto: propuesta === secreta,
    posicionesCorrectas,
  };
}

// Función para dar pistas sobre la palabra secreta, indicando si las letras propuestas están en la palabra secreta o no
function darPistas(posicionesCorrectas) {
  if (posicionesCorrectas.length === 0) {
    return { mensaje: "Ninguna letra es correcta", posicion: null };
  }
  const indice = Math.floor(Math.random() * posicionesCorrectas.length); // Si hay varias solo elegimos unas
  const posicionCorrecta = posicionesCorrectas[indice];
  return {
    mensaje: `La letra en la posición ${posicionCorrecta} es correcta`,
    posicionCorrecta,
  };
}

// Info de la partida al finalizar
function infoPartida(rondas, jugador1, jugador2) {
  const intentosTotales = { [jugador1]: 0, [jugador2]: 0 };
  const tiempoTotal = { [jugador1]: 0, [jugador2]: 0 };

  for (const ronda of rondas) {
    const jugador = ronda.jugadorAdivina;
    intentosTotales[jugador] += ronda.intentos.length;
    tiempoTotal[jugador] += ronda.tiempoSegundos;
  }

  let ganador = null;
  let resultado = "empate";

  // Filtramos para poder elegir el ganador, segun intentos o sino tiempo
  if (intentosTotales[jugador1] !== intentosTotales[jugador2]) {
    if (intentosTotales[jugador1] < intentosTotales[jugador2]) {
      ganador = jugador1;
      resultado = "gane";
    } else {
      ganador = jugador2;
      resultado = "gane";
    }
  } else if (tiempoTotal[jugador2] !== tiempoTotal[jugador1]) {
    if (tiempoTotal[jugador1] < tiempoTotal[jugador2]) {
      ganador = jugador1;
      resultado = "gane";
    } else {
      ganador = jugador2;
      resultado = "gane";
    }
  }
  return { ganador, resultado, intentosTotales, tiempoTotal };
}

module.exports = {
  elegirPalabraAleatoria,
  validarPalabra,
  elegirJugador,
  compararIntento,
  darPistas,
  infoPartida,
};
