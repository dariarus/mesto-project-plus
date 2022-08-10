import mongoose from 'mongoose';

export type TUser = {
  name: string,
  about: string,
  avatarImage: string,
};

export type TCard = {
  name: string,
  imageLink: string,
  ownerId: mongoose.ObjectId,
  likes: Array<mongoose.ObjectId>,
  createdAt: Date,
};
