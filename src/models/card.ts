import mongoose from 'mongoose';

import { TCard } from '../services/types';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: {},
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<TCard>('card', cardSchema);
