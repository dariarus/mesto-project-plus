import express, { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { JwtPayload } from 'jsonwebtoken';
import { errors } from 'celebrate';

import userRouter from './routes/users';
import cardRouter from './routes/cards';

import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';

import BadRequestError from './errors/error-400';
import IncorrectCredentialsError from './errors/error-401';
import UserRightsError from './errors/error-403';
import NotFoundError from './errors/error-404';

import auth from './middlewares/auth';
import UniqueFieldConflict from './errors/error-409';

require('dotenv').config();

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // до всех обработчиков роутов подкл-ся логер запросов
  app.use(requestLogger);

  app.post('/signin', login);
  app.post('/signup', createUser);

  app.use(auth);

  app.use('/users', userRouter);
  app.use('/cards', cardRouter);

  // после обработчиков роутов и до обработчиков ошибок подкл-ся логер ошибок
  app.use(errorLogger);

  // обработчик ошибок celebrate
  app.use(errors());

  app.use((
    err: Error | mongoose.Error | MongoServerError,
    req: Request & { user?: string | JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    console.log(err);
    let statusCode;
    let message;
    if (err instanceof NotFoundError
      || err instanceof BadRequestError
      || err instanceof IncorrectCredentialsError
      || err instanceof UserRightsError) {
      ({ statusCode, message } = err);
    } else if (err instanceof mongoose.Error.CastError
      || err instanceof mongoose.Error.ValidationError) {
      statusCode = BadRequestError.DEFAULT_STATUS_CODE;
      message = BadRequestError.DEFAULT_MESSAGE;
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = IncorrectCredentialsError.DEFAULT_STATUS_CODE;
      message = 'Ошибка авторизации';
    } else if (err instanceof MongoServerError && err.code === 11000) {
      statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
      message = UniqueFieldConflict.DEFAULT_MESSAGE;
    } else {
      statusCode = 500;
      message = 'На сервере произошла ошибка';
    }

    res
      .status(statusCode)
      .send({
        message,
      });

    next();
  });

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

mongoose.connect('mongodb://root:example@localhost:27017/mestodb?authSource=admin', (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
