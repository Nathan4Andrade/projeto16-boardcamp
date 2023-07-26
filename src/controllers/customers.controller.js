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
    const receita = await db.query(`SELECT * FROM customers WHERE id=${id};`);
    res.send(receita.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function createCustomer(req, res) {
  res.send("createCustomer");
}

export async function editCustomer(req, res) {
  res.send("editCustomer");
}
