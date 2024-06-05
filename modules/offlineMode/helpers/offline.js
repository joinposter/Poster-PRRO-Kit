import { pipe } from "ramda";

const fillUid = (request) => {
  const uid = crypto.randomUUID();

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
