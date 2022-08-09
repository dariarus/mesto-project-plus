export type TUser = {
  name: string,
  about: string,
  avatarImage: string,
};

export type TCard = {
  name: string,
  imageLink: string,
  ownerId: string,
  likes: Array<string>,
  createdAt: Date,
};
