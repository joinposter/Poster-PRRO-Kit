import qrcode from "qrcode-generator";

export const getQRCodeString = ({
  dfsDocumentFiscalId,
  cashbox,
  total,
  date,
  time,
}) =>
  `https://cabinet.tax.gov.ua/cashregs/check?id=${dfsDocumentFiscalId}&date=${date}&time=${time}&fn=${cashbox}&sm=${total}`;

const generateQRCodeReceiptData = ({
  dfsDocumentFiscalId,
  cashbox,
  total,
  dateTime,
}) => {
  const [date, time] = dateTime.split("T");
  console.log("generateQRCodeReceiptData", {
    dfsDocumentFiscalId,
    cashbox,
    total,
    date,
    time,
  });
  const qrCodeString = getQRCodeString({
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
