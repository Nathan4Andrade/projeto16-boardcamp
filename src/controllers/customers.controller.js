import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers;`);
    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [
      id,
    ]);
    if (!customer.rows[0]) res.sendStatus(404);
    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const existingCostumer = await db.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );
    if (existingCostumer.rows[0])
      return res.status(409).send("CPF já existente");

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const existingCostumer = await db.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );
    if (existingCostumer.rows[0])
      return res.status(409).send("CPF já existente");

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
