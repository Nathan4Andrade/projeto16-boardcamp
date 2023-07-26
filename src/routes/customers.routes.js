import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";
import {
  createCustomer,
  editCustomer,
  getCustomerById,
  getCustomers,
} from "../controllers/customers.controller.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.post(
  "/customers",
  validateSchema(customerSchema),
  createCustomer
);
customerRouter.put(
  "/customers/:id",
  validateSchema(customerSchema),
  editCustomer
);

export default customerRouter;
