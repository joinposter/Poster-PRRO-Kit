import qrcode from "qrcode-generator";
import PosterLogo from "../../../../i/public/Poster.js";
import { getControlSum, getCashboxStatus } from "../../helpers/receiptData.js";
import { DEFAULT_QR_MARGIN, DEFAULT_QR_SIZE } from "../../const/receipt.js";

const generateSvgQrCode = (data) => {
  const qrCode = qrcode(0, "L");
  qrCode.addData(data.fiscalLink);
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
            value: data.fiscalId.toString(),
            align: "center",
          }
        : null,
      data.dateTime
        ? {
            type: "footer-text",
            value: data.dateTime,
            align: "center",
          }
        : null,
      getControlSum(data)
        ? { type: "footer-text", value: getControlSum(data), align: "center" }
        : null,
      data.footerData
        ? {
            type: "footer-text",
            value: getCashboxStatus(data),
            align: "center",
          }
        : null,
      getControlSum(data)
        ? { type: "footer", value: getControlSum(data), align: "center" }
        : null,
      data?.cashboxData?.cashbox
        ? {
            type: "footer-text",
            value: data.cashboxData.cashbox.toString(),
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
