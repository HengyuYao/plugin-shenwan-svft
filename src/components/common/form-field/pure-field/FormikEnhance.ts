import { isArray } from 'lodash';

export const addErrorMessage = (error: any[] | undefined, message: string, level?: string): any[] => {
  const newError = {
    message,
    level: level || 'error',
  };
  if (isArray(error)) {
    return [...error, newError];
  }
  return [newError];
};
