import { messageSchema } from "../index.js";
import { messagesCollection } from "../database/db.js";
import dayjs from "dayjs";

export async function postMessage(req, res) {
  const message = req.message;

  try {
    await messagesCollection.insertOne(message);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getMessages(req, res) {
  const limit = Number(req.query.limit);
  const { user } = req.headers;

  try {
    const messages = await messagesCollection
      .find({
        $or: [
          // $or: Conjunto de filtros, literalmente um OU
          { from: user },
          { to: { $in: [user, "Todos"] } }, // $in: Possibilidades de valores dentro de um campo de filtro.
          { type: "message" },
        ],
      })
      .limit(limit)
      .toArray();

    if (messages.length === 0) {
      return res.status(404).send("Não foi encontrada nenhuma mensagem!");
    }

    res.send(messages);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteMessage(req, res) {
  const { id } = req.params;
  const { user } = req.headers;

  try {
    const existingMessage = await messagesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingMessage) {
      return res.sendStatus(404);
    }

    if (existingMessage.from !== user.participant) {
      return res.sendStatus(401);
    }

    await messagesCollection.deleteOne({
      _id: existingMessage._id,
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function putMessage(req, res) {
  const message = req.body;
  const { id } = req.params;
  const { user } = req.headers;

  try {
    const participantsCollection = mongoClient.collection("participants");
    const messagesCollection = mongoClient.collection("messages");

    const existingParticipant = await participantsCollection.findOne({
      name: user.from,
    });
    if (!existingParticipant) {
      return res.sendStatus(422);
    }

    const existingMessage = await messagesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingMessage) {
      return res.sendStatus(404);
    }

    if (existingMessage.from !== user.from) {
      return res.sendStatus(401);
    }

    await messagesCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: message,
      }
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
