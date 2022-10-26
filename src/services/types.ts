import mongoose from 'mongoose';

export type TUser = {
  email: string,
  password: string,
  name: string,
  about: string,
  avatarImage: string,
};

export type TCard = {
  name: string,
  imageLink: string,
  owner: mongoose.ObjectId,
  likes: Array<mongoose.ObjectId>,
  createdAt: Date,
};
