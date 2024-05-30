import qrcode from "qrcode-generator";
import { getDFSReceiptLink } from "../helpers/receipt.js";
import { getDateTime } from "../helpers/common.js";
import { DEFAULT_QR_MARGIN, DEFAULT_QR_SIZE } from "../const/receipt.js";

const generateQRCodeReceiptData = (data) => {
  const qrCodeString = getDFSReceiptLink({
    fiscalId: data.fiscalId,
    cashbox: data.cashboxData.cashbox,
    total: data.total,
    date: getDateTime({ data: data.dateTime, format: "date" }),
    time: getDateTime({ data: data.dateTime, format: "time" }),
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag(
    data?.qrOptions?.size || DEFAULT_QR_SIZE,
    data?.qrOptions?.margin || DEFAULT_QR_MARGIN,
  );
  return { qrCodeSvgTag, qrCodeString };
};

export default generateQRCodeReceiptData;
