import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@jatestorg/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', 1);

app.use(bodyParser.json());

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };