import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(
      `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      LEFT JOIN games ON rentals."gameId" = games.id;`
    );
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const rentDate = dayjs().format("DD-MM-YYYY");
  console.log(rentDate);
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

    /* await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, null, $5, null)`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    ); */

    await db.query(`UPDATE games SET "stockTotal" = $1 WHERE id=$2`, [
      exisitingGame.rows[0].stockTotal - 1,
      gameId,
    ]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function endRental(req, res) {
  const { id } = req.params;

  const returnDate = dayjs();
  try {
    const existingRental = await db.query(
      `SELECT * FROM rentals WHERE id = $1;`,
      [id]
    );

    if (!existingRental.rows[0])
      return res.status(404).send("Rental não existe");
    if (existingRental.rows[0].returnDate)
      return res.status(400).send("Rental já devolvido");

    const rentDate = dayjs(existingRental.rows[0].rentDate);
    const daysRented = existingRental.rows[0].daysRented;
    const expectedDay = dayjs(existingRental.rows[0].rentDate).add(
      daysRented,
      "day"
    );
    const differenceInDays = returnDate.diff(rentDate, "day");

    console.log("dia alugado: " + rentDate.format("DD-MM-YYYY"));
    console.log("dias de aluguel: " + daysRented);
    console.log("dia esperado: " + expectedDay.format("DD-MM-YYYY"));
    console.log("dia devolvido: " + returnDate.format("DD-MM-YYYY"));
    console.log("diferença de dias:", differenceInDays);

    const originalPrice = existingRental.rows[0].originalPrice;
    const delayFeeCalc = (differenceInDays - daysRented) * originalPrice;
    const delayFee = delayFeeCalc > 0 ? delayFeeCalc : 0;
    console.log(delayFee);
    await db.query(
      `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2  WHERE id=$3`,
      [returnDate, delayFee, id]
    );

    const exisitingGame = await db.query(
      `SELECT id, "stockTotal" FROM games WHERE id = $1;`,
      [existingRental.rows[0].gameId]
    );
    await db.query(`UPDATE games SET "stockTotal" = $1 WHERE id=$2`, [
      exisitingGame.rows[0].stockTotal + 1,
      existingRental.rows[0].gameId,
    ]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const existingRental = await db.query(
      `SELECT * FROM rentals WHERE id = $1;`,
      [id]
    );
    if (!existingRental.rows[0])
      return res.status(404).send("Rental não existe");

    console.log(existingRental.rows[0].returnDate);
    if (!existingRental.rows[0].returnDate)
      return res.status(400).send("Rental não foi devolvido");

    await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
