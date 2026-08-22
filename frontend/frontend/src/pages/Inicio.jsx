import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearPartida } from "../api";

export default function Inicio() {
  const [nombreA, setNombreA] = useState("");
  const [nombreB, setNombreB] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");

    if (!nombreA.trim() || !nombreB.trim()) {
      setError("Ingrese el nombre de los jugadores.");
      return;
    }

    setCargando(true);
    try {
      const partida = await crearPartida(nombreA.trim(), nombreB.trim());
      navegar(`/juego/${partida.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h1>Batalla de Palabras</h1>
        <Link className="enlace-historial" to="/historial">
          Ver historial
        </Link>
      </div>

      <div className="panel">
        <form onSubmit={manejarEnvio}>
          <div className="campo">
            <label htmlFor="nombreA">Jugador A</label>
            <input
              id="nombreA"
              value={nombreA}
              onChange={(evento) => setNombreA(evento.target.value)}
              placeholder="Nombre del primer jugador"
              autoFocus
            />
          </div>

          <div className="campo">
            <label htmlFor="nombreB">Jugador B</label>
            <input
              id="nombreB"
              value={nombreB}
              onChange={(evento) => setNombreB(evento.target.value)}
              placeholder="Nombre del segundo jugador"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="boton" type="submit" disabled={cargando}>
            {cargando ? "Sorteando jugadores..." : "Iniciar partida"}
          </button>
        </form>
      </div>
    </div>
  );
}
