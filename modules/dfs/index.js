import FISCAL_RECEIPT_SERVER_ADDRESS from "./const.js";

const getDFSFiscalLink = ({
  fiscalId,
  cashbox,
  sum,
  date,
  time,
  previousDocumentHash,
}) => {
  let link = `${FISCAL_RECEIPT_SERVER_ADDRESS}?id=${fiscalId}&date=${date}&time=${time}&fn=${cashbox}&sm=${sum}`;
  if (previousDocumentHash) {
    link += `&mac=${previousDocumentHash}`;
  }
  return link;
};

export default getDFSFiscalLink;
