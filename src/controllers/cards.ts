import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import Card from '../models/card';
import UserRightsError from '../errors/error-403';
import NotFoundError from '../errors/error-404';

const NOT_FOUND_MESSAGE = 'Карточка с указанным _id не найдена';

// получить все карточки
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.send([]);
      }
      res.send(cards);
    })
    .catch(next);
};

// создать новую карточку
export const createCard = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

// удалить карточку
export const deleteCard = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(NOT_FOUND_MESSAGE));
        return;
      }
      if (String(card.owner) !== (req.user as JwtPayload)._id) {
        next(new UserRightsError());
        return;
      }
      card.remove().then(() => res.send(card)).catch(next);
    })
    .catch(next);
};

// поставить лайк карточке
export const likeCard = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: (req.user as JwtPayload)._id },
    }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      res.send(card);
    })
    .catch(next);
};

// убрать лайк с карточки
export const dislikeCard = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: (req.user as JwtPayload)._id },
    }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      res.send(card);
    })
    .catch(next);
};
