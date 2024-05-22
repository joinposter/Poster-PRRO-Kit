const getFiscalCompanyData = ({
  name,
  pointName,
  pointAddress,
  tin,
  cashier,
}) =>
  [
    name ? { type: "text", value: name, align: "center" } : null,
    pointName ? { type: "text", value: pointName, align: "center" } : null,
    pointAddress
      ? { type: "text", value: pointAddress, align: "center" }
      : null,
    { type: "text", value: tin, align: "center" },
    cashier ? { type: "text", value: cashier, align: "center" } : null,
    { type: "ruler" },
  ].filter(Boolean);

export default getFiscalCompanyData;
