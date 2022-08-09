import mongoose from 'mongoose';

import { Request, Response, NextFunction } from 'express';

import Card from '../models/card';
import BadRequestError from '../errors/error-400';
import NotFoundError from '../errors/error-404';

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
  req: Request & { user?: { _id: string }},
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

// удалить карточку
export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};

// поставить лайк карточке
export const likeCard = (
  req: Request & { user?: { _id: mongoose.ObjectId }},
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};

// убрать лайк с карточки
export const dislikeCard = (
  req: Request & { user?: { _id: mongoose.ObjectId }},
  res: Response,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};
