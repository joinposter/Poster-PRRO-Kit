import { FISCAL_RECEIPT_SERVER_ADDRESS } from "./const.js";

export const getDFSFiscalLink = ({ fiscalId, cashbox, sum, date, time, lastDocumentHash }) => {
  let link = `${FISCAL_RECEIPT_SERVER_ADDRESS}?id=${fiscalId}&date=${date}&time=${time}&fn=${cashbox}&sm=${sum}`;
  if (lastDocumentHash) {
    link += `&mac=${lastDocumentHash}`;
  }
  return link;
}
