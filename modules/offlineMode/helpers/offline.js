import { pipe } from "ramda";
import { v4 as uuidv4 } from "uuid";

const fillUid = (request) => {
  const uid = uuidv4();

  return { ...request, uid };
};

const fillDateTimeIfEmpty = (request) => {
  const { dateTime } = request;

  if (!dateTime) {
    return { ...request, dateTime: new Date() };
  }
  return request;
};

// eslint-disable-next-line import/prefer-default-export
export const expandDocumentData = pipe(fillUid, fillDateTimeIfEmpty);
