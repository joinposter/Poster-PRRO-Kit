import qrcode from "qrcode-generator";
import PosterLogo from "../../../../../../i/public/Poster.js";
import {
  getCashboxStatus,
  getControlSum,
} from "../../../../helpers/receiptData.js";
import { getDFSReceiptLink } from "../../../../helpers/receipt.js";
import { getDateTime } from "../../../../../../helpers/common.js";
import {
  DEFAULT_QR_MARGIN,
  DEFAULT_QR_SIZE,
} from "../../../../const/receipt.js";

const generateSvgQrCode = (data) => {
  const qrCodeString = getDFSReceiptLink({
    fiscalId: data.fiscalId,
    cashbox: data.cashboxData.cashbox,
    total: data.total,
    date: getDateTime({ date: data.dateTime, format: "dateQr" }),
    time: getDateTime({ date: data.dateTime, format: "timeQr" }),
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
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
        ? { type: "footer-text", value: data.dateTime, align: "center" }
        : null,
      { type: "footer-text", value: getCashboxStatus(data), align: "center" },
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
