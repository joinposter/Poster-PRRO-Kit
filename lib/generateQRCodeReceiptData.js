import qrcode from "qrcode-generator";
import { getDFSReceiptLink } from "../helpers/receipt.js";
import { getDateTime } from "../helpers/common.js";

const generateQRCodeReceiptData = (data) => {
  const qrCodeString = getDFSReceiptLink({
    dfsDocumentFiscalId: data.dfsDocumentFiscalId,
    cashbox: data.cashboxData.cashbox,
    total: data.total,
    date: getDateTime({ data: data.dateTime, format: "date" }),
    time: getDateTime({ data: data.dateTime, format: "time" }),
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag();
  return { qrCodeSvgTag, qrCodeString };
};

export default generateQRCodeReceiptData;
