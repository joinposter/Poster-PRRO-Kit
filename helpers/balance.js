import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SERVICE_ENTRY,
  PAYMENT_TYPE_CASH,
} from "../const/types.js";

// eslint-disable-next-line import/prefer-default-export
export const getBalanceDiffByRequest = (request) => {
  const { type } = request;
  const isPaymentTypeCash = (p) => p.type === PAYMENT_TYPE_CASH;

  const negativeMultiplier = -1;
  switch (type) {
    case DOCUMENT_TYPE_RECEIPT:
      return request.payments.find(isPaymentTypeCash)?.sum || 0;
    case DOCUMENT_TYPE_RETURN_RECEIPT:
      return (
        negativeMultiplier *
        (request.payments.find(isPaymentTypeCash)?.sum || 0)
      );
    case DOCUMENT_TYPE_SERVICE_ENTRY:
    case DOCUMENT_TYPE_SERVICE_DELIVERY:
      return request.sum;
    default:
      return 0;
  }
};
