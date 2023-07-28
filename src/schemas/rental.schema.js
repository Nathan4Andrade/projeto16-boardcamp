import joi from "joi";

export const rentalSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  daysRented: joi.number().required(),
});

export const endRentalSchema = joi.object({
  returnDate: joi.date().required(),
  delayFee: joi.number().required(),
});
