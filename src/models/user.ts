import mongoose from 'mongoose';
import validator from 'validator';

import { LINK_REGEX } from '../utils/constants';

import { TUser } from '../services/types';

function validateAvatarLink(v: string) {
  return ('') || LINK_REGEX.test(v);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неверный формат электронного адреса',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: [validateAvatarLink, 'Validation avatar URL error'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

export default mongoose.model<TUser>('user', userSchema);
