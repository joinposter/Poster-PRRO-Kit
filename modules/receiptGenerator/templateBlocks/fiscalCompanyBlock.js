import { isLLC } from "../../XMLDocuments/helpers/xmlGenerator.js";

const getFiscalCompanyData = ({
  name,
  pointName,
  pointType = "",
  pointAddress,
  tin,
  ipn,
  cashier,
}) => {
  const actualName = isLLC(tin) ? name : `ФОП ${name}`;

  return [
    name
      ? { type: "text", value: actualName, align: "center", bold: true }
      : null,
    pointName
      ? {
          type: "text",
          value: `${pointType} "${pointName}"`,
          align: "center",
          bold: false,
        }
      : null,
    pointAddress
      ? { type: "text", value: pointAddress, align: "center", bold: false }
      : null,
    {
      type: "text",
      value: ipn ? `ПН ${ipn}` : `ІД ${tin}`,
      align: "center",
      bold: false,
    },
    cashier
      ? {
          type: "text",
          value: `Касир ${cashier}`,
          align: "center",
          bold: false,
        }
      : null,
  ].filter(Boolean);
};

export default getFiscalCompanyData;
