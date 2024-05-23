const INN_LENGTH = 10;
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
    {
      type: "text",
      value:
        tin.length < INN_LENGTH
          ? `ІД ${tin.toString()}`
          : `ПН ${tin.toString()}`,
      align: "center",
    },
    cashier
      ? { type: "text", value: `Касир ${cashier}`, align: "center" }
      : null,
    { type: "ruler" },
  ].filter(Boolean);

export default getFiscalCompanyData;
