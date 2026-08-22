import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { obtenerPartida, enviarIntento, avanzarSiguienteRonda } from "../api";
import FilaFichas from "../components/FilaFichas";

export default function Juego() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [partida, setPartida] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [campoIntento, setCampoIntento] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [listoParaAdivinar, setListoParaAdivinar] = useState(false);

  useEffect(() => {
    cargarPartida();
  }, [id]);

  async function cargarPartida() {
    try {
      const datos = await obtenerPartida(id);
      setPartida(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarEnvioIntento(evento) {
    evento.preventDefault();
    setError("");

    if (!campoIntento.trim()) return;

    setEnviando(true);
    try {
      const resultado = await enviarIntento(id, campoIntento.trim());
      setPartida(resultado.partida);
      setCampoIntento("");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarSiguienteRonda() {
    setError("");
    try {
      const partidaActualizada = await avanzarSiguienteRonda(id);
      setPartida(partidaActualizada);
      setListoParaAdivinar(false); // vuelve a pedir confirmación de turno
    } catch (err) {
      setError(err.message);
    }
  }

  if (cargando) {
    return (
      <div className="contenedor">
        <p>Cargando partida...</p>
      </div>
    );
  }

  if (error && !partida) {
    return (
      <div className="contenedor">
        <p className="error">{error}</p>
        <Link className="enlace-historial" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const rondaActual = partida.rondas[partida.rondas.length - 1];
  const jugadorAdivina = rondaActual.jugadorAdivina;
  const jugadorObserva =
    jugadorAdivina === partida.jugador1 ? partida.jugador2 : partida.jugador1;

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h1>Batalla de Palabras</h1>
        <Link className="enlace-historial" to="/historial">
          Ver historial
        </Link>
      </div>

      <div className="marcador">
        <div className="jugador">
          {partida.jugador1}
          <span className="rol">
            {partida.jugador1 === jugadorAdivina ? "Adivinando" : "Observando"}
          </span>
        </div>
        <div className="jugador">
          {partida.jugador2}
          <span className="rol">
            {partida.jugador2 === jugadorAdivina ? "Adivinando" : "Observando"}
          </span>
        </div>
      </div>

      {/* ── Partida finalizada: mostrar resumen ── */}
      {partida.estado === "finalizada" && partida.resumen && (
        <div className="panel">
          <h2>Resultado final</h2>
          <p style={{ color: "var(--color-texto-tenue)", marginTop: "0.5rem" }}>
            {partida.resumen.resultado === "gane"
              ? `Ganó ${partida.resumen.ganador}`
              : "La partida terminó en empate"}
          </p>

          <table style={{ marginTop: "1.25rem" }}>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Intentos totales</th>
                <th>Tiempo total (s)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{partida.jugador1}</td>
                <td>{partida.resumen.intentosTotales[partida.jugador1]}</td>
                <td>{partida.resumen.tiempoTotal[partida.jugador1]}</td>
              </tr>
              <tr>
                <td>{partida.jugador2}</td>
                <td>{partida.resumen.intentosTotales[partida.jugador2]}</td>
                <td>{partida.resumen.tiempoTotal[partida.jugador2]}</td>
              </tr>
            </tbody>
          </table>

          <button
            className="boton"
            style={{ marginTop: "1.5rem" }}
            onClick={() => navegar("/")}
          >
            Jugar otra partida
          </button>
        </div>
      )}

      {/* ── Pantalla de cambio de turno ── */}
      {partida.estado === "en_curso" && !listoParaAdivinar && (
        <div className="panel">
          <h2>Cambio de turno</h2>
          <p style={{ color: "var(--color-texto-tenue)", marginTop: "0.5rem" }}>
            Ronda {rondaActual.numero} de 6 — le toca adivinar a{" "}
            <strong>{jugadorAdivina}</strong>. {jugadorObserva}, dejá de mirar
            la pantalla.
          </p>
          <button
            className="boton"
            style={{ marginTop: "1.25rem" }}
            onClick={() => setListoParaAdivinar(true)}
          >
            {jugadorAdivina}, estoy listo
          </button>
        </div>
      )}

      {/* ── Ronda finalizada, esperando avanzar ── */}
      {partida.estado === "en_curso" &&
        listoParaAdivinar &&
        rondaActual.finalizada && (
          <div className="panel">
            <h2>¡Ronda completada!</h2>
            <p
              style={{ color: "var(--color-texto-tenue)", marginTop: "0.5rem" }}
            >
              {jugadorAdivina} adivinó en {rondaActual.intentos.length}{" "}
              intento(s) y {rondaActual.tiempoSegundos} segundos.
            </p>
            <button
              className="boton"
              style={{ marginTop: "1.25rem" }}
              onClick={manejarSiguienteRonda}
            >
              Siguiente ronda
            </button>
          </div>
        )}

      {/* ── Juego activo: input de intento + historial de intentos ── */}
      {partida.estado === "en_curso" &&
        listoParaAdivinar &&
        !rondaActual.finalizada && (
          <div className="panel">
            <h2>Ronda {rondaActual.numero} de 6</h2>
            <p
              style={{
                color: "var(--color-texto-tenue)",
                margin: "0.5rem 0 1.25rem",
              }}
            >
              La palabra tiene <strong>{rondaActual.longitud}</strong>{" "}
              caracteres.
            </p>

            {rondaActual.intentos.map((intento, indice) => (
              <div key={indice}>
                <FilaFichas
                  palabra={intento.palabra}
                  posicionCorrecta={intento.posicionCorrecta}
                />
                <p className="intento-pista">{intento.pista}</p>
              </div>
            ))}

            <form onSubmit={manejarEnvioIntento} style={{ marginTop: "1rem" }}>
              <div className="campo">
                <label htmlFor="intento">Tu intento</label>
                <input
                  id="intento"
                  value={campoIntento}
                  onChange={(evento) => setCampoIntento(evento.target.value)}
                  maxLength={rondaActual.longitud}
                  autoFocus
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button className="boton" type="submit" disabled={enviando}>
                {enviando ? "Comprobando..." : "Enviar intento"}
              </button>
            </form>
          </div>
        )}
    </div>
  );
}
