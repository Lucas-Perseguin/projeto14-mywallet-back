import Joi from 'joi';

const statementSchema = Joi.object({
  value: Joi.number().required(),
  description: Joi.string().required(),
  isIncome: Joi.boolean().required(),
});

export default function statementSchemaValidation(req, res, next) {
  const statement = req.body;

  const { error } = statementSchema.validate(statement, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
}
