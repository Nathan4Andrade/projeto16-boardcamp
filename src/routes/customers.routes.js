import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customerRouter = Router();

customerRouter.get("/customer", getCustomers);
customerRouter.get("/customer:id", getCustomerById);
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
