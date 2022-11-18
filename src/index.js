import express from "express";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();

import { removeParticipantsInactives } from "./controllers/participants.controller.js";
import participantsRouters from "./routes/participants.routes.js";
import messagesRouters from "./routes/messages.routes.js";

const app = express();
app.use(express.json());
/* app.use(cors()) */
app.use(participantsRouters);
app.use(messagesRouters);

export const participantSchema = joi.object({
  name: joi.string().required().min(3),
});

export const messageSchema = joi.object({
  from: joi.string().required(),
  to: joi.string().required().min(3),
  text: joi.string().required().min(1),
  type: joi.string().required().valid("message", "private_message"),
  time: joi.string(),
});

setInterval(removeParticipantsInactives, 15000);

app.listen(5000, () => console.log("Port 5000"));
