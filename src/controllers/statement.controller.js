import { statementsCollection } from '../database/db.js';
import dayjs from 'dayjs';

export async function postStatement(req, res) {
  const username = req.headers.user;
  try {
    const today = dayjs().format('DD/MM');
    const month = dayjs().format('MM');
    await statementsCollection.insertOne({
      ...req.body,
      date: today,
      username,
      month,
    });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function getStatements(req, res) {
  const username = req.headers.user;
  const month = dayjs().fomrat('MM');
  try {
    const statements = await statementsCollection
      .find({
        username,
      })
      .toArray();

    if (statements.length === 0) {
      return res
        .status(404)
        .send('Não foi encontrada nenhuma entrada ou saída!');
    }

    const userMonthStatements = statements.filter(
      (statement) =>
        statement.username === username && statement.month === month
    );

    res.json(...userMonthStatements.reverse());
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function deleteStatement(req, res) {
  const { _id } = req.query;
  if (!_id) {
    return res.sendStatus(400);
  }
  try {
    const existingStatement = await statementsCollection.findOne({
      _id: new ObjectId(_id),
    });
    if (!existingStatement) {
      return res.sendStatus(404);
    }

    if (existingStatement.username !== req.headers.user) {
      return res.sendStatus(401);
    }

    await statementsCollection.deleteOne({
      _id: existingStatement._id,
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function putStatement(req, res) {
  const { _id } = req.query;
  const { value, description } = req.body;
  const username = req.header.user;

  if (!_id) {
    return res.sendStatus(400);
  }

  try {
    const existingMessage = await statementsCollection.findOne({
      _id: new ObjectId(_id),
    });
    if (!existingMessage) {
      return res.sendStatus(404);
    }

    if (existingMessage.username !== username) {
      return res.sendStatus(401);
    }

    await statementsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { value, description },
      }
    );

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
