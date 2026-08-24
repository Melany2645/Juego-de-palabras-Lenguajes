import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerHistorial } from "../api";

// Pide la información de las partidas ya realizadas
export default function Historial() {
  const [partidas, setPartidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerHistorial()
      .then(setPartidas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h1>Historial</h1>
        <Link className="enlace-historial" to="/">
          Nueva partida
        </Link>
      </div>

      {cargando && <p>Cargando historial...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && partidas.length === 0 && (
        <p style={{ color: "var(--color-texto-tenue)" }}>
          Todavía no hay partidas registradas.
        </p>
      )}

      {partidas.length > 0 && (
        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Jugadores</th>
                <th>Intentos</th>
                <th>Tiempo (s)</th>
                <th>Resultados</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map((partida) => (
                <tr key={partida.id}>
                  <td>
                    {partida.jugador1} vs {partida.jugador2}
                  </td>
                  <td>
                    {partida.resumen
                      ? `${partida.resumen.intentosTotales[partida.jugador1]} / ${
                          partida.resumen.intentosTotales[partida.jugador2]
                        }`
                      : "En curso"}
                  </td>
                  <td>
                    {partida.resumen
                      ? `${partida.resumen.tiempoTotal[partida.jugador1]} / ${
                          partida.resumen.tiempoTotal[partida.jugador2]
                        }`
                      : "En curso"}
                  </td>
                  <td>
                    {partida.estado === "finalizada"
                      ? partida.resumen.resultado === "gane"
                        ? `Ganó ${partida.resumen.ganador}`
                        : "Empate"
                      : "En curso"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
