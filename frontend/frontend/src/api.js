// Aquí es donde se conecta a la API del backend mediante solicitudes HTTP
/************************Datos administrativos****************************
 * Nombre del proyecto: Batalla de Palabras
 * Archivo: api.js
 * Autor: Melany Jirón
 * Empresa: Instituto Tecnológico de Costa Rica
 * ******************************Descripción*****************************
 * Aquí es donde se conecta a la API del backend mediante solicitudes HTTP.
 * ******************************Versión*********************************
 * 1.0 | 23/08/2026 | Melany Jirón
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Manejo derespuestas del backend
async function manejarRespuestas(respuestas) {
  const datos = await respuestas.json();
  if (!respuestas.ok) {
    throw new Error(datos.error || "Ocurrió un error");
  }
  return datos;
}

// Utilizando los nombres de los jugadores
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
