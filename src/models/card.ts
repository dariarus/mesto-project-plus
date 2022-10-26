import mongoose from 'mongoose';

import { LINK_REGEX } from '../utils/constants';

import { TCard } from '../services/types';

function validateCardLink(v: string) {
  return LINK_REGEX.test(v);
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: [validateCardLink, 'Validation card image URL error'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<TCard>('card', cardSchema);
