/************************Datos administrativos****************************
 * Nombre del proyecto: Batalla de Palabras
 * Archivo: primeroIndex.js
 * Autor: Melany Jirón
 * Empresa: Instituto Tecnológico de Costa Rica
 * ******************************Descripción*****************************
 * Este archivo contiene la inicialización del servidor, el cual se comunica frontend.
 * ******************************Versión*********************************
 * 1.0 | 23/08/2026 | Melany Jirón
 *************************************************************************/

//import express from "express";
const express = require("express");
//import cors from "cors";
const cors = require("cors");

//import partidasConneciones from "./partidasConecciones.js";
const partidasConneciones = require("./partidasConecciones.js");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Espero que esto funcione, amén!!");
});

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Definimos rutas, se conectan las rutas con las funciones correspondientes
const router = express.Router();

router.post("/partidas", partidasConneciones.crearPartida);
router.get("/partidas", partidasConneciones.obtenerHistorial);
router.get("/partidas/:id", partidasConneciones.obtenerDetalles);
router.post("/partidas/:id/palabra", partidasConneciones.ingresarPalabra);
router.post("/partidas/:id/intento", partidasConneciones.registrarIntento);
router.post("/partidas/:id/siguiente-ronda", partidasConneciones.cambiarRonda);

app.use("/api", router);

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no enontrada." });
});

app.use((err, req, res, next) => {
  console.error("Error no encontrado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(
    "Servidor de batalla de palabras escuchanod en el puerto ${PORT}",
  );
});
