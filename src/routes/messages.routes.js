import {
  postMessage,
  getMessages,
  deleteMessage,
  putMessage,
} from "../controllers/messages.controller.js";

import { Router } from "express";
import { validationUser } from "../middlewares/validateUser.middleware.js";
import { schemaMessageValidation } from "../middlewares/schemaMessageValidation.middleware.js";

const router = Router();

router.use(validationUser);

router.post("/messages", schemaMessageValidation, postMessage);

router.get("/messages", getMessages);

router.delete("/messages/:id", deleteMessage);

router.put("/messages/:id",schemaMessageValidation,  putMessage);

export default router;
