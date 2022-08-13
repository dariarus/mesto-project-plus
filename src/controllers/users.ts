import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/user';

import NotFoundError from '../errors/error-404';
import BadRequestError from '../errors/error-400';
import IncorrectCredentialsError from '../errors/error-401';

const { NODE_ENV, JWT_SECRET } = process.env;
const NOT_FOUND_MESSAGE = 'Пользователь по указанному _id не найден';

// получить всех юзеров
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.send([]);
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
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      res.send(user);
    })
    .catch(next);
};

// eslint-disable-next-line max-len
export const getUser = (req: Request & { user?: JwtPayload | string }, res: Response, next: NextFunction) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
        return;
      }
      res.send(user);
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError());
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            next(new IncorrectCredentialsError());
            return;
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret',
            { expiresIn: '7d' },
          );
          // отправим токен, браузер сохранит его в куках
          res.send({ token });
          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            });
        }).catch(next);
    }).catch(next);
};

// создать нового юзера
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!password) {
    next(new BadRequestError());
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// обновить профиль
export const updateProfile = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  if ((!name && !about) || req.body.avatar) {
    next(new BadRequestError());
    return;
  }

  User.findByIdAndUpdate(
    (req.user as JwtPayload)._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      res.send(user);
    })
    .catch(next);
};

// обновить аватар
export const updateAvatar = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  if (!avatar || (req.body.name || req.body.about)) {
    next(new BadRequestError());
    return;
  }

  User.findByIdAndUpdate(
    (req.user as JwtPayload)._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};
