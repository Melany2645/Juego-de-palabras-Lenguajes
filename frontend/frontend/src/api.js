// Aquí es donde se conecta a la API del backend

const BASE_URL = import.meta.env.VITE_API_URL || "http:localhost_3001/api";

async function manejarRespuestas(respuestas) {
  const datos = await respuestas.json();
  if (!respuestas.ok) {
    throw new Error(datos.error || "Ocurrió un error");
  }
  return datos;
}

export async function crearPartida(nombreJugador1, nombreJugador2) {
  const respuesta = await fetch(`${BASE_URL}/partidas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreJugador1, nombreJugador2 }),
  });
  return manejarRespuestas(respuesta);
}

export async function enviarIntento(id, intento) {
  const respuesta = await fetch(`${BASE_URL}/partidas/${id}/intento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intento }),
  });
  return manejarRespuestas(respuesta);
}

export async function ingresarPalabra(id, palabra) {
  const respuesta = await fetch(`${BASE_URL}/partidas/${id}/palabra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ palabra }),
  });
  return manejarRespuestas(respuesta);
}

export async function obtenerPartida(id) {
  const respuesta = await fetch(`${BASE_URL}/partidas/${id}`);
  return manejarRespuestas(respuesta);
}

export async function avanzarSiguienteRonda(id) {
  const respuesta = await fetch(`${BASE_URL}/partidas/${id}/siguiente-ronda`, {
    method: "POST",
  });
  return manejarRespuestas(respuesta);
}

export async function obtenerHistorial() {
  const respuesta = await fetch(`${BASE_URL}/partidas`);
  return manejarRespuestas(respuesta);
}
