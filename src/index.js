import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/user.routes.js';
import statementsRouter from './routes/statement.routes.js';

//config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(usersRouter);
app.use(statementsRouter);

//turn server on
app.listen(5000, () => console.log('Port 5000'));
