import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose, { Error } from 'mongoose';

import userRouter from './routes/users';
import cardRouter from './routes/cards';
import NotFoundError from './errors/error-404';

const { PORT = 3001 } = process.env;

const runApp = () => {
  const app = express();
  app.use((req: any, res, next) => {
    req.user = {
      _id: '62ed4d409f02d00a4d5ff8a2', // вставьте сюда _id созданного в предыдущем пункте пользователя
    };
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', userRouter);
  app.use('/cards', cardRouter);
  app.use(express.static(path.join(__dirname, 'public')));
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  // app.use((err: Error, req: Request, res: Response, next:NextFunction) => {
  //   console.log(err);
  //
  //   let statusCode;
  //   let message;
  //   if (err instanceof NotFoundError) {
  //     ({ statusCode, message } = err);
  //   } else if (err instanceof mongoose.Error.ValidationError) {
  //     statusCode = 400;
  //     message = 'Неверно сформирован запрос';
  //   } else {
  //     statusCode = 500;
  //     message = 'На сервере произошла ошибка';
  //   }
  //
  //   res
  //     .status(statusCode)
  //     .send({
  //       message,
  //     });
  //
  //   next();
  // });
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
// runApp();