import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send(
    "Vamos empezando con el juego de palabras de Lenguajes de Programación",
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
