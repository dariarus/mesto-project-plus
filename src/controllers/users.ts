import { Request, Response } from 'express';

import User from '../models/user';

// получить всех юзеров
export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send(users);
      } else {
        throw new Error('Неверно сформирован запрос');
      }
    })
    // .catch(next);
    .catch((err) => {
      res
        .status(400)
        .send({
          message: err.message,
        });
    });
};

// получить юзера по id
export const getUserById = (req: any, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new Error('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .send({
          message: 'Пользователь по указанному _id не найден',
        });
    });
};

// создать нового юзера
export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      if (!name || !about || !avatar) {
        throw new Error();
      } else {
        res.send(user);
      }
    })
    // .catch(next)
    .catch(() => {
      res
        .status(400)
        .send({
          message: 'Неверно сформирован запрос',
        });
    });
};

// обновить профиль
export const updateProfile = (req: any, res: Response) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (req.user._id !== '62ed4d409f02d00a4d5ff8a2' || !name || !about) {
        console.log('error');
        throw new Error();
      } else {
        console.log('user');
        res.send(user);
      }
    })
    .catch((err) => {
      console.log(err);
      // const { statusCode = 500 } = err;
      if (req.user._id !== '62ed4d409f02d00a4d5ff8a2') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
        /* }
        else if (statusCode === 500) {
          res.send({ message: 'На сервере произошла ошибка' }); */
      } else {
        res
          .status(400)
          .send({message: 'Неверно сформирован запрос'});
      }
    });
};

// обновить аватар
export const updateAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (req.user._id !== '62ed4d409f02d00a4d5ff8a2' || !avatar) {
        throw new Error();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      console.log(err);
      // const { statusCode = 500 } = err;
      if (req.user._id !== '62ed4d409f02d00a4d5ff8a2') {
        res
          .status(404)
          .send({message: 'Пользователь с указанным _id не найден'});
        /* }
        else if (statusCode === 500) {
          res.send({ message: 'На сервере произошла ошибка' }); */
      } else {
        res
          .status(400)
          .send({ message: 'Неверно сформирован запрос' });
      }
    });
};
