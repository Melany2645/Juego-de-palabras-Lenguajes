import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  obtenerPartida,
  ingresarPalabra,
  enviarIntento,
  avanzarSiguienteRonda,
} from "../api";
import FilaFichas from "../components/FilaFichas";

// Manejo de las reglas del juego, las diferentes validaciones
export default function Juego() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [partida, setPartida] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [campoIntento, setCampoIntento] = useState("");
  const [campoPalabra, setCampoPalabra] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [listoParaIngresarPalabra, setListoIngresarPalabra] = useState(false);
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

  async function manejarEnvioPalabra(evento) {
    evento.preventDefault();
    setError("");

    if (!campoPalabra.trim()) return;

    setEnviando(true);
    try {
      const partidaActualizada = await ingresarPalabra(id, campoPalabra.trim());
      setPartida(partidaActualizada);
      setCampoPalabra("");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
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
      setListoIngresarPalabra(false);
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
  const jugadorIngresaPalabra =
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
      {/* ── Fase 1: falta ingresar la palabra de esta ronda ── */}
      {partida.estado === "en_curso" &&
        !rondaActual.palabraIngresada &&
        !listoParaIngresarPalabra && (
          <div className="panel">
            <h2>Cambio de turno</h2>
            <p
              style={{
                color: "var(--color-texto-tenue)",
                marginTop: "0.5rem",
              }}
            >
              Ronda {rondaActual.numero} de 6 — le toca ingresar la palabra a{" "}
              <strong>{jugadorIngresaPalabra}</strong>. {jugadorAdivina}, dejá
              de mirar la pantalla.
            </p>
            <button
              className="boton"
              style={{ marginTop: "1.25rem" }}
              onClick={() => setListoIngresarPalabra(true)}
            >
              {jugadorIngresaPalabra}, estoy listo
            </button>
          </div>
        )}

      {/* ── Pantalla de cambio de turno ── */}
      {partida.estado === "en_curso" &&
        !rondaActual.palabraIngresada &&
        listoParaIngresarPalabra && (
          <div className="panel">
            <h2>Ingresá la palabra secreta</h2>
            <p
              style={{
                color: "var(--color-texto-tenue)",
                margin: "0.5rem 0 1.25rem",
              }}
            >
              Entre 4 y 8 caracteres. {jugadorAdivina} no puede ver esta
              pantalla.
            </p>
            <form onSubmit={manejarEnvioPalabra}>
              <div className="campo">
                <label htmlFor="palabra">Palabra secreta</label>
                <input
                  id="palabra"
                  type="password"
                  value={campoPalabra}
                  onChange={(evento) => setCampoPalabra(evento.target.value)}
                  minLength={4}
                  maxLength={8}
                  autoFocus
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button className="boton" type="submit" disabled={enviando}>
                {enviando ? "Guardando..." : "Confirmar palabra"}
              </button>
            </form>
          </div>
        )}

      {/* ── Fase 2: palabra lista, falta que el que adivina confirme turno ── */}
      {partida.estado === "en_curso" &&
        rondaActual.palabraIngresada &&
        !rondaActual.finalizada &&
        !listoParaAdivinar && (
          <div className="panel">
            <h2>Cambio de turno</h2>
            <p
              style={{
                color: "var(--color-texto-tenue)",
                marginTop: "0.5rem",
              }}
            >
              Ronda {rondaActual.numero} de 6 — le toca adivinar a{" "}
              <strong>{jugadorAdivina}</strong>. {jugadorIngresaPalabra}, dejá
              de mirar la pantalla.
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
        rondaActual.palabraIngresada &&
        listoParaAdivinar &&
        rondaActual.finalizada && (
          <div className="panel">
            <h2>¡Ronda completada!</h2>
            <p
              style={{
                color: "var(--color-texto-tenue)",
                marginTop: "0.5rem",
              }}
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
        rondaActual.palabraIngresada &&
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
