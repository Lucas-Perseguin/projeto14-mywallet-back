import { usersCollection } from '../database/db.js';
import { v4 as uuidV4 } from 'uuid';

export async function postUserSignUp(req, res) {
  try {
    const hashPassword = bcrypt.hashSync(password, 12);
    const token = uuidV4();
    await usersCollection.insertOne({
      username,
      email,
      password: hashPassword,
      token,
    });
    res.status(201).json(token);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function postUserSignIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(422);
  }

  try {
    const userFound = await usersCollection.findOne({ email });
    if (!userFound) {
      return res.send(409);
    }
    const passwordOk = bcrypt.compareSync(password, userFound.password);
    if (!passwordOk) {
      return res.sendStatus(400);
    }
    res.send({ token: userFound.token, username: userFound.username });
  } catch (err) {
    res.sendStatus(500);
  }
}
