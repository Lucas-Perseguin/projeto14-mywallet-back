import { usersCollection } from '../database/db';
import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default async function userExists(req, res, next) {
  const { username, email, password } = req.body;

  const { error } = userSchema.validate(
    { username, email, password },
    { abortEarly: false }
  );

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const userFound = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (userFound) {
      return res.sendStatus(400);
    } else {
      next();
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
