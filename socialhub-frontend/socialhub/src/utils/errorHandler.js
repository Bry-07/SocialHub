import { MESSAGES } from './constants';

export const getErrorMessage = (error) => {
  if (!error?.response) return MESSAGES.CONNECTION_ERROR;

  switch (error.response.status) {
    case 400:
      return MESSAGES.INVALID_DATA;
    case 404:
      return MESSAGES.NOT_FOUND;
    case 500:
      return MESSAGES.SERVER_ERROR;
    default:
      return MESSAGES.UNEXPECTED_RESPONSE;
  }
};