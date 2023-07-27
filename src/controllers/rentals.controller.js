import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  try {
    res.send("getRentals");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    //verifica se daysRented é maior que 0
    if (daysRented <= 0) return res.sendStatus(400);
    console.log(daysRented);
    // verifica se o cliente existe
    const existingCostumer = await db.query(
      `SELECT id FROM customers WHERE id = $1;`,
      [customerId]
    );
    if (!existingCostumer.rows[0]) return res.sendStatus(400);

    // verifica se o jogo existe
    const exisitingGame = await db.query(
      `SELECT id, "stockTotal" FROM games WHERE id = $1;`,
      [gameId]
    );
    if (!exisitingGame.rows[0]) return res.sendStatus(400);
    if (!exisitingGame.rows[0].stockTotal <= 0) return res.sendStatus(400);

    // calcula o valor do aluguel
    const originalPrice =
      daysRented *
      (await db.query(`SELECT "pricePerDay" FROM games WHERE id=$'`, [gameId]));

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
