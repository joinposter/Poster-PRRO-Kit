import { pipe } from "ramda";
import { v4 as uuidv4 } from "uuid";
import createDateWithUATimezone from "../../receiptGenerator/helpers/time.js";

const fillUid = (request) => {
  const uid = uuidv4();

  return { ...request, uid };
};

const fillDateTimeIfEmpty = (request) => {
  const dateTime = createDateWithUATimezone(request.dateTime);

  return { ...request, dateTime };
};

// eslint-disable-next-line import/prefer-default-export
export const expandDocumentData = pipe(fillUid, fillDateTimeIfEmpty);
