import PosterLogo from "../../../../i/public/Poster.js";
import {
  getCashboxInfo,
  getCashboxStatus,
  getControlSum,
} from "../../helpers/receiptData.js";

const htmlFooterBlock = (data) => [
  { type: "ruler" },
  {
    type: "footer",
    lines: [
      data.fiscalId
        ? {
            type: "footer-text",
            value: data.fiscalId.toString(),
            align: "center",
          }
        : null,
      data.dateTime
        ? { type: "footer-text", value: data.dateTime, align: "center" }
        : null,
      { type: "footer-text", value: getCashboxStatus(data), align: "center" },
      getControlSum(data)
        ? { type: "footer", value: getControlSum(data), align: "center" }
        : null,
      data?.cashboxData?.cashbox
        ? {
            type: "footer-text",
            value: getCashboxInfo(data),
            align: "center",
          }
        : null,
      data?.footerData?.docType
        ? {
            type: "footer-text",
            value: data.footerData.docType,
            align: "center",
          }
        : null,
      { type: "footer-logo", value: PosterLogo, align: "center" },
    ].filter(Boolean),
  },
];

export default htmlFooterBlock;
