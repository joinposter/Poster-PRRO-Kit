import qrcode from "qrcode-generator";
import PosterLogo from "../../../../i/public/Poster.js";
import {
  getCashboxInfo,
  getCashboxStatus,
  getControlSum,
  isFiscalReceiptReturnType,
} from "../../helpers/receiptData.js";
import { DEFAULT_QR_MARGIN, DEFAULT_QR_SIZE } from "../../const/receipt.js";

const generateSvgQrCode = (data) => {
  const qrCode = qrcode(0, "L");
  qrCode.addData(data.footerData.dFSReceiptLink);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag(
    data?.qrOptions?.size || DEFAULT_QR_SIZE,
    data?.qrOptions?.margin || DEFAULT_QR_MARGIN,
  );
  return qrCodeSvgTag;
};

const htmlFooterBlock = (data) => [
  { type: "ruler" },
  {
    type: "footer",
    lines: [
      data.fiscalId
        ? {
            type: "footer-text",
            value: `${isFiscalReceiptReturnType(data.type) ? "" : "Чек №"}  ${data.fiscalId.toString()}`,
            align: "center",
          }
        : null,
      data.dateTime
        ? { type: "footer-text", value: data.dateTime, align: "center" }
        : null,
      { type: "footer-text", value: getCashboxStatus(data), align: "center" },
      getControlSum(data.footerData)
        ? {
            type: "footer-text",
            value: getControlSum(data.footerData),
            align: "center",
          }
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
      { type: "footer-qr", value: generateSvgQrCode(data), align: "center" },
    ].filter(Boolean),
  },
];

export default htmlFooterBlock;
