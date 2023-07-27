import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";
import {
  createRental,
  deleteRental,
  endRental,
  getRentals,
} from "../controllers/rentals.controller.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", validateSchema(rentalSchema), createRental);
rentalRouter.post(
  "/rentals/:id/return",
  validateSchema(rentalSchema),
  endRental
);
rentalRouter.delete("/rentals/:id", deleteRental);

export default rentalRouter;
