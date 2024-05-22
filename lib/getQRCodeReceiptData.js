import qrcode from "qrcode-generator";

export const getQRCodeString = ({ dfsId, fiscalNumber, amount, date, time }) =>
  `https://cabinet.tax.gov.ua/cashregs/check?id=${dfsId}&date=${date}&time=${time}&fn=${fiscalNumber}&sm=${amount}`;

const getQRCodeReceiptData = ({ dfsId, fiscalNumber, amount, date, time }) => {
  const qrCodeString = getQRCodeString({
    dfsId,
    fiscalNumber,
    amount,
    date,
    time,
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag();
  return { qrCodeSvgTag, qrCodeString };
};

export default getQRCodeReceiptData;
