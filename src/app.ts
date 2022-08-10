import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Error } from 'mongoose';

import userRouter from './routes/users';
import cardRouter from './routes/cards';
import NotFoundError from './errors/error-404';
import BadRequestError from './errors/error-400';

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();
  app.use((req: Request & { user?: { _id: string }}, res: Response, next: NextFunction) => {
    req.user = {
      _id: '62ed4d409f02d00a4d5ff8a2', // вставьте сюда _id созданного в предыдущем пункте пользователя
    };
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', userRouter);
  app.use('/cards', cardRouter);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode;
    let message;
    if (err instanceof NotFoundError || err instanceof BadRequestError) {
      ({ statusCode, message } = err);
    } else if (err instanceof mongoose.Error.CastError
      || err instanceof mongoose.Error.ValidationError) {
      statusCode = BadRequestError.DEFAULT_STATUS_CODE;
      message = BadRequestError.DEFAULT_MESSAGE;
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
};

// mongoose буферизиризирует функции модели по умолчанию. Из-за этого он не кидает ошибок,
// если использовать модель без подключения к БД
// mongoose.set('bufferCommands', false);

mongoose.connect('mongodb://root:example@localhost:27017/mestodb?authSource=admin', (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});
