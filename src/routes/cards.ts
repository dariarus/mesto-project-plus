import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

import { LINK_REGEX, customValidateId } from '../utils/constants';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(LINK_REGEX).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(customValidateId, 'custom id validation'),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(customValidateId, 'custom id validation'),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(customValidateId, 'custom id validation'),
  }),
}), dislikeCard);

export default router;
