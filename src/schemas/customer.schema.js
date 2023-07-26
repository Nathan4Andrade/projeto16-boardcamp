import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().length(11).required(),
  cpf: joi.string().length(11).required(),
  birthday: joi.date().less("now"),
});
