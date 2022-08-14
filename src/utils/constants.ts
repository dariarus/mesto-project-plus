import mongoose from "mongoose";
import NotFoundError from '../errors/error-404';

export const TOKEN_REGEX = /jwt=[A-Za-z0-9\-._~+/]+=*/;
export const LINK_REGEX = /^(https?):\/\/[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,20}(:[0-9]{1,5})?(\/.*)?$/i;

export const customValidateId = (value: mongoose.ObjectId) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new Error('id is not valid');
  }
  return value;
};
