import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(
      `SELECT rentals.*, customers.id, customers.name, games.id, games.name FROM rentals JOIN customers ON rentals."customerId" = customers.id LEFT JOIN games ON rentals."gameId" = games.id;`
    );
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    //verifica se daysRented é maior que 0
    if (daysRented <= 0) return res.sendStatus(400);

    // verifica se o cliente existe
    const existingCostumer = await db.query(
      `SELECT id FROM customers WHERE id = $1;`,
      [customerId]
    );
    if (!existingCostumer.rows[0])
      return res.status(400).send("Cliente não existe");

    // verifica se o jogo existe
    const exisitingGame = await db.query(
      `SELECT id, "stockTotal" FROM games WHERE id = $1;`,
      [gameId]
    );

    if (!exisitingGame.rows[0]) return res.status(400).send("Jogo não existe");

    if (exisitingGame.rows[0].stockTotal <= 0)
      return res.status(400).send("Jogo sem estoque");

    // calcula o valor do aluguel
    const gamePrice = await db.query(
      `SELECT "pricePerDay" FROM games WHERE id=$1`,
      [gameId]
    );
    const price = gamePrice.rows[0].pricePerDay;
    const originalPrice = price * daysRented;
    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, null, $4, null)`,
      [customerId, gameId, daysRented, originalPrice]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function endRental(req, res) {
  try {
    res.send("endRental");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  try {
    res.send("deleteRental");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
