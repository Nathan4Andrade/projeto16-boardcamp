import { db } from "../database/database.connection";

export async function getGames(req, res) {
  res.send("getGames");
}

export async function createames(req, res) {
  res.send("createGame");
}
