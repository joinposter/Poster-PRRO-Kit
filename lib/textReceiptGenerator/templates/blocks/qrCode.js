const getQRCodeString = async ({ dfsId, fiscalNumber, amount, date, time }) =>
  `https://cabinet.tax.gov.ua/cashregs/check?id=${dfsId}&date=${date}&time=${time}&fn=${fiscalNumber}&sm=${amount}`;

export default getQRCodeString;
