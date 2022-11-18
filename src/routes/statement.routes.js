import {
  postStatement,
  getStatements,
  deleteStatement,
  putStatement,
} from '../controllers/statement.controller.js';

import userHeadersStatementValidation from '../middlewares/userHeadersStatementValidation.middleware.js';
import statementSchemaValidation from '../middlewares/statementSchemaValidation.middleware.js';

import { Router } from 'express';

const router = Router();

router.use(userHeadersStatementValidation);

router.get('/statements', getStatements);

router.delete('/statements/:_id', deleteStatement);

router.use(statementSchemaValidation);

router.post('/statements', postStatement);

router.put('/statements/:_id', putStatement);

export default router;
