export type Message = string;
export type ErrorFieldKey = string;
export type ErrorMessage = {
  message: Message;
  level: 'error' | string;
};

export type FormError = Record<ErrorFieldKey, ErrorMessage[]>;
