import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar, getUser,
} from '../controllers/users';

const router = Router();

const TOKEN_REGEX = /Bearer\s[A-Za-z0-9\-._~+/]+=*/;

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
}), getUsers);

router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
}), getUser);

router.get('/:userId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(TOKEN_REGEX).required(),
  }).unknown(true),
}), updateAvatar);

export default router;
