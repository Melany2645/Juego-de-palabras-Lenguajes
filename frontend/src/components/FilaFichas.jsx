export default function FilaFichas({ palabra, posicionCorrecta }) {
  return (
    <div className="fila-ficha">
      {palabra.split("").map((letra, indice) => {
        const numeroPosicion = indice + 1;
        const esCorrecta = numeroPosicion === posicionCorrecta;
        return (
          <div key={indice} className={`ficha ${esCorrecta ? "correcta" : ""}`}>
            {letra}
          </div>
        );
      })}
    </div>
  );
}
