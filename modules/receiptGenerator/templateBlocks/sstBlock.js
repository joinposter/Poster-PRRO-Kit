const getSstData = ({
  bank,
  terminal,
  terminalId,
  actionType,
  cardNumber,
  pan,
  paymentSystem,
  paymentSystemName,
  authCode,
  rrn,
}) => [
  {
    type: "smartTable",
    hideTopBorder: false,
    items: [
      bank ? { row: [bank, ""] } : null,
      terminalId || terminal ? { row: [terminalId || terminal, ""] } : null,
      actionType ? { row: [actionType, ""] } : null,
      cardNumber || pan
        ? {
            row: ["ЕПЗ", cardNumber || pan],
            styles: { 0: { extraCssClass: "text-secondary" } },
          }
        : null,
      paymentSystem || paymentSystemName
        ? {
            row: ["ПЛАТІЖНА СИСТЕМА", paymentSystem || paymentSystemName],
            styles: { 0: { extraCssClass: "text-secondary" } },
          }
        : null,
      authCode
        ? {
            row: ["КОД АВТ.", authCode],
            styles: { 0: { extraCssClass: "text-secondary" } },
          }
        : null,
      { row: ["RRN", rrn], styles: { 0: { extraCssClass: "text-secondary" } } },
    ].filter(Boolean),
  },
];

export default getSstData;
