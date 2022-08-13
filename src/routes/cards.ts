import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

const TOKEN_REGEX = /Bearer\s[A-Za-z0-9\-._~+/]+=*/;

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
}), getCards);

router.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

export default router;
