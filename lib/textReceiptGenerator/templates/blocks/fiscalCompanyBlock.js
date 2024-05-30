const getFiscalCompanyData = ({
  name,
  pointName,
  pointAddress,
  tin,
  ipn,
  cashier,
}) =>
  [
    name ? { type: "text", value: name, align: "center", bold: true } : null,
    pointName
      ? { type: "text", value: pointName, align: "center", bold: false }
      : null,
    pointAddress
      ? { type: "text", value: pointAddress, align: "center", bold: false }
      : null,
    {
      type: "text",
      value: ipn ? `ПН ${ipn.toString()}` : `ІД ${tin.toString()}`,
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

export default getFiscalCompanyData;
