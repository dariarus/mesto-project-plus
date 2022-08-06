import { Request, Response } from 'express';

import Card from '../models/card';

// получить все карточки
export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send(cards);
      } else {
        throw new Error('Неверно сформирован запрос');
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({
          message: err.message,
        });
    });
};

// создать новую карточку
export const createCard = (req: any, res: Response) => {
  // console.log(req.user._id); // _id станет доступен

  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!name || !link) {
        throw new Error();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .send({
          message: 'Неверно сформирован запрос',
        });
    });
};

// удалить карточку
export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      // const { statusCode = 500 } = err;
      console.log(err);
      res
        .status(404)
        .send({
          message: 'Карточка с указанным _id не найдена',
        });
    //  }
    });
};

// поставить лайк карточке
export const likeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Передан несуществующий _id карточки');
      } else if (req.user._id !== '62ed4d409f02d00a4d5ff8a2') {
        throw new Error('Неверно сформирован запрос');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      if (err.message === 'Передан несуществующий _id карточки') {
        res
          .status(404)
          .send({ message: err.message });
      } else {
        res
          .status(400)
          .send({ message: err.message });
      }
    });
};

// убрать лайк с карточки
export const dislikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Передан несуществующий _id карточки');
      } else if (req.user._id !== '62ed4d409f02d00a4d5ff8a2') {
        throw new Error('Неверно сформирован запрос');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      if (err.message === 'Передан несуществующий _id карточки') {
        res
          .status(404)
          .send({ message: err.message });
      } else {
        res
          .status(400)
          .send({ message: err.message });
      }
    });
};
