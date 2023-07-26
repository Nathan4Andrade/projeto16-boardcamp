import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  try {
    const games = await db.query("SELECT * FROM games;");
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const existingGame = await db.query(
      `SELECT * FROM customers WHERE name = $1;`,
      [name]
    );
    if (existingGame.rows[0]) return res.status(409).send("Jogo já existente");

    const game = await db.query(`INSERT INTO games VALUES ($1, $2, $3, $4)`, [
      name,
      image,
      stockTotal,
      pricePerDay,
    ]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
