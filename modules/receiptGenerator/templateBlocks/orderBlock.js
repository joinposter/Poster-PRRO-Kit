const getOrderData = ({
  orderNumber,
  orderType,
  openDate,
  printDate,
  tableId,
  hallName,
  guestAmount,
}) => ({
  type: "smartProperties",
  lines: [
    { name: "Чек №", value: orderNumber },
    { name: "Тип замовлення", value: orderType },
    { name: "Відкрито", value: openDate },
    { name: "Надруковано", value: printDate },
    { name: "Стіл №", value: `${tableId} (${hallName})` },
    { name: "К-сть гостей", value: guestAmount },
  ],
});

export default getOrderData;
