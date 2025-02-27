import {
  getCashboxInfo,
  getCashboxStatus,
  getControlSum,
  isFiscalReceiptReturnType,
} from "../../helpers/receiptData.js";

const textFooterBlock = (data) =>
  [
    { type: "ruler" },
    data.fiscalId
      ? {
          type: "text",
          value: `${isFiscalReceiptReturnType(data.type) ? "" : "Чек №"} ${data.fiscalId.toString()}`,
          align: "center",
        }
      : null,
    data.dateTime
      ? { type: "text", value: data.dateTime, align: "center" }
      : null,
    { type: "text", value: getCashboxStatus(data), align: "center" },
    getControlSum(data.footerData)
      ? { type: "text", value: getControlSum(data.footerData), align: "center" }
      : null,
    data?.cashboxData?.cashbox
      ? {
          type: "text",
          value: getCashboxInfo(data),
          align: "center",
        }
      : null,
    data?.footerData?.docType
      ? { type: "text", value: data.footerData.docType, align: "center" }
      : null,
    data?.footerData?.software
      ? { type: "text", value: data.footerData.software, align: "center" }
      : null,
  ].filter(Boolean);

export default textFooterBlock;
