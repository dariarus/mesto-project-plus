import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar, getUser,
} from '../controllers/users';

import { TOKEN_REGEX, LINK_REGEX, customValidateId } from '../utils/constants';

const router = Router();

router.get('/', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().regex(TOKEN_REGEX).required(),
    // cookie: Joi.string().token().required(),
  }).unknown(true),
}), getUsers);

router.get('/me', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().regex(TOKEN_REGEX).required(),
  }).unknown(true),
}), getUser);

router.get('/:userId', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().regex(TOKEN_REGEX).required(),
  }).unknown(true),
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidateId, 'custom id validation'),
  }),
}), getUserById);

router.patch('/me', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().regex(TOKEN_REGEX).required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().regex(TOKEN_REGEX).required(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().regex(LINK_REGEX),
  }),
}), updateAvatar);

export default router;
