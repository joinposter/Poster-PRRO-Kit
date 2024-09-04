import { getCashboxStatus, getControlSum } from "../../helpers/receiptData.js";

const textFooterBlock = (data) =>
  [
    { type: "ruler" },
    data.fiscalId
      ? {
          type: "text",
          value: data.fiscalId.toString(),
          align: "center",
        }
      : null,
    data.dateTime
      ? { type: "text", value: data.dateTime, align: "center" }
      : null,
    { type: "text", value: getCashboxStatus(data), align: "center" },
    getControlSum(data)
      ? { type: "text", value: getControlSum(data), align: "center" }
      : null,
    data?.cashboxData?.cashbox
      ? {
          type: "text",
          value: data.cashboxData.cashbox.toString(),
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
