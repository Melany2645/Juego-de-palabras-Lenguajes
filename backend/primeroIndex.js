import express from "express";
import cors from "cors";

import partidasConneciones from "./partidasConecciones.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Espero que esto funcione, amén!!");
});

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Definimos rutas

const router = express.Router();

router.post("/partidas", partidasConneciones.crearPartida);
router.get("/partidas", partidasConneciones.obtenerHistorial);
router.get("/partidas/:id", partidasConneciones.obtenerDetalles);
router.post("/partidas/:id/palabra", partidasConneciones.ingresarPalabra);
router.post("/partidas/:id/intento", partidasConneciones.registrarIntento);
router.post("/partidas/:id/siguiente-ronda", partidasConneciones.cambiarRonda);

app.use("/api", router);

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
