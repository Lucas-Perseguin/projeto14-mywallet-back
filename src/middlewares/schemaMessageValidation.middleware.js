import { messageSchema } from "../index.js";
import dayjs from "dayjs";

export function schemaMessageValidation(req, res, next) {
  const { to, text, type } = req.body;
  const { user } = req.headers;

  const message = {
    from: user,
    to,
    text,
    type,
    time: dayjs().format("HH:mm:ss"),
  };

  const { error } = messageSchema.validate(message, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  req.message = message

  next();
}
