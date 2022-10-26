import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar, getUser,
} from '../controllers/users';

import { LINK_REGEX, customValidateId } from '../utils/constants';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidateId, 'custom id validation'),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(LINK_REGEX),
  }),
}), updateAvatar);

export default router;
