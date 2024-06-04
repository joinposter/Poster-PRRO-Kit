const getSstData = ({
  bank,
  terminal,
  actionType,
  cardNumber,
  paymentSystem,
  authCode,
  rrn,
  cashier,
  holder,
}) => [
  {
    type: "smartTable",
    hideTopBorder: false,
    items: [
      { row: [bank, ""] },
      { row: [terminal, ""] },
      { row: [actionType, ""] },
      {
        row: ["ЕПЗ", cardNumber],
        styles: { 0: { color: "text-secondary" } },
      },
      {
        row: ["ПЛАТІЖНА СИСТЕМА", paymentSystem],
        styles: { 0: { color: "text-secondary" } },
      },
      {
        row: ["КОД АВТ.", authCode],
        styles: { 0: { color: "text-secondary" } },
      },
      { row: ["RRN", rrn], styles: { 0: { color: "text-secondary" } } },
      { row: ["КАСИР", cashier], styles: { 0: { color: "text-secondary" } } },
      {
        row: ["ДЕРЖАТЕЛЬ ЕПЗ", holder],
        styles: { 0: { color: "text-secondary" } },
      },
    ],
  },
];

export default getSstData;
