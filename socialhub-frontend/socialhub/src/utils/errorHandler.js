import { MESSAGES } from './constants';

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || MESSAGES.GENERIC_ERROR;
};