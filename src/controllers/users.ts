import { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import NotFoundError from '../errors/error-404';
import BadRequestError from '../errors/error-400';

// получить всех юзеров
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new Error();
      }
      res.send(users);
    })
    .catch(next);
};

// получить юзера по id
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// создать нового юзера
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// обновить профиль
export const updateProfile = (
  req: Request & { user?: { _id: string }},
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  if ((!name && !about) || req.body.avatar) {
    next(new BadRequestError());
  }

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// обновить аватар
export const updateAvatar = (
  req: Request & { user?: { _id: string }},
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  if (!avatar || (req.body.name || req.body.about)) {
    next(new BadRequestError());
  }

  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};
