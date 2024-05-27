const getFiscalCompanyData = ({
  name,
  pointName,
  pointAddress,
  tin,
  ipn,
  cashier,
}) =>
  [
    name ? { type: "text", value: name, align: "center" } : null,
    pointName ? { type: "text", value: pointName, align: "center" } : null,
    pointAddress
      ? { type: "text", value: pointAddress, align: "center" }
      : null,
    {
      type: "text",
      value: ipn ? `ПН ${ipn.toString()}` : `ІД ${tin.toString()}`,
      align: "center",
    },
    cashier
      ? { type: "text", value: `Касир ${cashier}`, align: "center" }
      : null,
  ].filter(Boolean);

export default getFiscalCompanyData;
