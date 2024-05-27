import qrcode from "qrcode-generator";
import { getDFSReceiptLink } from "../helpers/receipt.js";

const generateQRCodeReceiptData = ({
  dfsDocumentFiscalId,
  cashbox,
  total,
  date,
  time,
}) => {
  const qrCodeString = getDFSReceiptLink({
    dfsDocumentFiscalId,
    cashbox,
    total,
    date,
    time,
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag();
  return { qrCodeSvgTag, qrCodeString };
};

export default generateQRCodeReceiptData;
