import receiptConfig from "./config/receiptConfig.js";

export const cashboxConfig = {
  name: "ТОВ ТЕСТ ПРРО",
  unit: 'Кафе "Мʼята"',
  address:
    "Дніпропетровська область, м. Дніпро, Амур-Нижньодніпровський район, вул. Шолом-Алейхема, 4, кв. (Офіс) 31",
  kodPdv: null,
  inn: "12345678",
  fn: 4000244601,
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
