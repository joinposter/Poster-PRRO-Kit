import { JSON_STRINGIFY_SPACE } from "../const/taxes.js";

// eslint-disable-next-line import/prefer-default-export
export const showError = (message, program, object) =>
  `${message}: "${program}" \n${JSON.stringify(object, 0, JSON_STRINGIFY_SPACE)}`;
