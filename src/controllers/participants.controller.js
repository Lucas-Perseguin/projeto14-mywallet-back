import { participantSchema } from "../index.js";
import { messagesCollection, participantsCollection } from "../database/db.js";
import dayjs from "dayjs";

export async function postParticipants(req, res) {
  const { name } = req.body;

  const { error } = participantSchema.validate({ name }, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const participantExists = await participantsCollection.findOne({ name });
    if (participantExists) {
      return res.sendStatus(409);
    }

    await participantsCollection.insertOne({ name, lastStatus: Date.now() });

    await messagesCollection.insertOne({
      from: name,
      to: "Todos",
      text: "entrei na sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getParticipants(req, res) {
  try {
    const participants = await participantsCollection.find().toArray();
    if (!participants) {
      return res.sendStatus(404);
    }

    res.send(participants);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postStatus(req, res) {
  const { user } = req.headers;

  try {
    const participantExists = await participantsCollection.findOne({
      name: user,
    });

    if (!participantExists) {
      return res.sendStatus(404);
    }

    await participantsCollection.updateOne(
      { name: user },
      { $set: { lastStatus: Date.now() } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function removeParticipantsInactives() {
  console.log("Removendo geral!");

  const dateTenSecondsAgo = Date.now() - 10000;
  /* console.log(Date.now());
    console.log(dateTenSecondsAgo); */

  try {
    // $lte: Literalmente menor ou igual (<=) a algum valor especifico
    const participantsInactives = await participantsCollection
      .find({ lastStatus: { $lte: dateTenSecondsAgo } })
      .toArray();

    if (participantsInactives.length > 0) {
      const inactivesMessages = participantsInactives.map((participant) => {
        return {
          from: participant.name,
          to: "Todos",
          text: "sai da sala...",
          type: "status",
          time: dayjs().format("HH:mm:ss"),
        };
      });

      await messagesCollection.insertMany(inactivesMessages);
      await participantsCollection.deleteMany({
        lastStatus: { $lte: dateTenSecondsAgo },
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

// opção de exportação
/* export {
    postParticipants,
    getParticipants,
    postStatus,
    removeParticipantsInactives
} */
