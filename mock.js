import receiptConfig from "./config/receiptConfig.js";

export const cashboxConfig = {
  name: "ТОВ ТЕСТ ПРРО",
  unit: 'Кафе "Мʼята"',
  address:
    "Дніпропетровська область, м. Дніпро, Амур-Нижньодніпровський район, вул. Шолом-Алейхема, 4, кв. (Офіс) 31",
  kodPdv: null,
  inn: "12345678",
  fn: "4000244601",
};
export const getServiceInputBodyMock = {
  sum: 2850,
  date: "16.05.2024",
  time: "19:28:35",
  receiptConfig,
  cashboxConfig,
};

export const getServiceOutputBodyMock = {
  sum: 750,
  date: "16.05.2024",
  time: "19:48:35",
  receiptConfig,
  cashboxConfig,
};

export const orderInfo = {
  orderNumber: 1650,
  orderType: "У закладі",
  openDate: "16 травня 2024 19:28:35",
  printDate: "16 травня 2024 19:29:35",
  tableId: 1,
  hallName: "Зал 1",
  guestAmount: 2,
};

export const productsInfo = [
  {
    uktzed: "2204109600#",
    barcode: "12345678",
    exciseStamp: "ADCC123123",
    name: "Вино",
    amount: 2,
    price: 130.02,
    guestAmount: 2,
    taxPrograms: "ДГ",
  },
  {
    uktzed: "2204888600#",
    barcode: "",
    exciseStamp: "",
    name: "Сир",
    amount: 4,
    price: 260,
    guestAmount: 2,
    taxPrograms: "Д",
  },
];

export const taxesInfo = {
  total: 1300.04,
  taxes: [
    { name: "ПДВ 20%", value: 214.6 },
    { name: "Акциз 5%", value: 12.38 },
  ],
};

export const paymentInfo = [
  { name: "Готівкою", value: 200 },
  { name: "Карткою", value: 1100 },
  { name: "До сплати", value: 1300 },
  { name: "Заокруглення", value: 0.04 },
];

export const bankInfo = {
  bank: "ПриватБанк",
  terminal: "S1260S6Y",
  actionType: "Оплата",
  paymentSystem: "MASTERCARD",
  cardNumber: "1234********5678",
  authCode: 199016,
  rrn: "082699265208",
  cashier: "..........",
  holder: "..........",
};

export const footerInfo = {
  message: "Вас очикує приємний сюрприз!",
  inn: cashboxConfig.inn,
  printDate: "16 травня 2024 19:29:35",
  fn: cashboxConfig.fn,
  status: "ОНЛАЙН",
  kodPdv: cashboxConfig.kodPdv,
};
