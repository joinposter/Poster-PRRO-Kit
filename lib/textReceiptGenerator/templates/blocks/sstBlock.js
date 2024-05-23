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
}) => ({
  type: "smartTable",
  hideTopBorder: true,
  items: [
    [bank, ""],
    [terminal, ""],
    [actionType, ""],
    ["ЕПЗ", cardNumber],
    ["ПЛАТІЖНА СИСТЕМА", paymentSystem],
    ["КОД АВТ.", authCode],
    ["RRN", rrn],
    ["КАСИР", cashier],
    ["ДЕРЖАТЕЛЬ ЕПЗ", holder],
  ],
});

export default getSstData;
