const getSstData = ({
  bank,
  terminal,
  actionType,
  paymentSystem,
  cardNumber,
  authCode,
  rrn,
  cashier,
  holder,
}) => ({
  type: "smartTable",
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
