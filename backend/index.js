import express from "express";
import cors from "cors";

import partidasConneciones from "./partidasConecciones.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Definimos rutas

const router = express.Router();

router.post("/partidas", partidasConneciones.crearPartida);
router.post("/partidas", partidasConneciones.obtenerHistorial);
router.post("/partidas/:id", partidasConneciones.obtenerDetalles);
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
