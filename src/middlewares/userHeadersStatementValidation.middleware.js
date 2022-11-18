import { usersCollection } from '../database/db';

export default async function userHeadersStatementValidation(req, res, next) {
  const { user, authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!user || !token) {
    return res.sendStatus(401);
  }
  const userFound = await usersCollection.findOne({ token });
  if (userFound.username !== user) {
    return res.sendStatus(401);
  }
  next();
}
