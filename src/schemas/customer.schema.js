import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().min(1).required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi
    .string()
    .pattern(/^[0-9]{11}$/)
    .required(),
  birthday: joi.date().iso().raw(),
});
