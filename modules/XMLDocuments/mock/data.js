export const receiptRequestData = {
  type: "receipt",
  total: 950.04,
  payments: [
    { sum: 100, type: "cash" },
    { sum: 850.04, type: "card" },
  ],
  products: [
    {
      id: 54,
      name: "Сирна паличка",
      count: 4,
      unit: "шт",
      price: 200,
      discount: 30,
      taxPrograms: "ГД",
    },
    {
      id: 55,
      name: "Морозиво",
      count: 2,
      unit: "шт",
      price: 90.13,
      discount: 20,
      taxPrograms: "БД",
    },
    {
      id: 56,
      name: "Кава",
      count: 1,
      unit: "шт",
      price: 20.13,
      discount: 0.35,
      taxPrograms: "В",
    },
  ],
  cashboxData: {
    cashbox: "4000438533",
    tin: 44657555,
    ipn: null,
    name: "ТОВ ТЕСТ ПРРО",
    pointName: "кафе Ромашка",
    pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
    cashboxLocalNumber: "123",
    isOffline: true,
    isTestingMode: true,
    nextDocumentNumber: 2834,
    offlineSessionData: {
      id: "23649865",
      seed: "135969449201653",
      nextOfflineDocumentNumber: 4,
      lastDocumentHash:
        "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
    },
  },
  cashier: "Шевченко Т.Г.",
  dateTime: "2024-04-18T15:16:17",
  uid: "11111111-1111-1111-1111-111111111111",
};

export const receiptRequestDatInCentsAndGrams = {
  type: "receipt",
  total: { sum: 95004, isInCents: true },
  payments: [
    { sum: 10000, type: "cash", isInCents: true },
    { sum: 85004, type: "card", isInCents: true },
  ],
  products: [
    {
      id: 54,
      name: "Сирна паличка",
      count: 4000,
      unit: "шт",
      price: 20000,
      discount: 3000,
      taxPrograms: "ГД",
      isInCentsAndGrams: true,
    },
    {
      id: 55,
      name: "Морозиво",
      count: 2000,
      unit: "шт",
      price: 9013,
      discount: 2000,
      taxPrograms: "БД",
      isInCentsAndGrams: true,
    },
    {
      id: 56,
      name: "Кава",
      count: 1000,
      unit: "шт",
      price: 2013,
      discount: 35,
      taxPrograms: "В",
      isInCentsAndGrams: true,
    },
  ],
  cashboxData: {
    cashbox: "4000438533",
    tin: 44657555,
    ipn: null,
    name: "ТОВ ТЕСТ ПРРО",
    pointName: "кафе Ромашка",
    pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
    cashboxLocalNumber: "123",
    isOffline: true,
    isTestingMode: true,
    nextDocumentNumber: 2834,
    offlineSessionData: {
      id: "23649865",
      seed: "135969449201653",
      nextOfflineDocumentNumber: 4,
      lastDocumentHash:
        "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
    },
  },
  cashier: "Шевченко Т.Г.",
  dateTime: "2024-04-18T15:16:17",
  uid: "11111111-1111-1111-1111-111111111111",
};

export const operationData = {
  cashboxData: {
    cashbox: "4000438533",
    tin: 44657555,
    name: "ТОВ ТЕСТ ПРРО",
    pointName: "кафе Ромашка",
    pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
    cashboxLocalNumber: "123",
    isOffline: true,
    isTestingMode: true,
    offlineSessionData: {
      id: 23649865,
      seed: 135969449201653,
      nextOfflineDocumentNumber: 1,
      lastDocumentHash:
        "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
    },
    nextDocumentNumber: 1,
  },
  cashier: "Шевченко Т.Г.",
};

export const cashboxData = {
  tin: 44657555,
  name: "ТОВ ТЕСТ ПРРО",
  pointName: "кафе Ромашка",
  pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
  cashbox: "4000438533",
  cashier: "Шевченко Т.Г.",
  cashboxLocalNumber: "123",
  isOffline: true,
  isTestingMode: true,
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextOfflineDocumentNumber: 1,
    lastDocumentHash:
      "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
  },
};

export const zReportData = {
  realiz: {
    sum: 27710.69,
    receiptCount: 87,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 8700,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 19010.69,
      },
    ],
    taxes: [
      {
        type: 2,
        name: "ПДВ 20%",
        program: "Б",
        percent: 20,
        turnover: 4506.5,
        sum: 901.5,
      },
      {
        type: 5,
        name: "Акциз 5%",
        program: "Д",
        percent: 5,
        turnover: 20900.94,
        sum: 1019.05,
      },
      {
        type: 4,
        name: "ПДВ 20%",
        program: "Г",
        percent: 20,
        turnover: 3777.33,
        sum: 603.22,
      },
    ],
  },
  return: null,
  serviceInput: 0,
  serviceOutput: 0,
  dateTime: "2024-04-18T15:16:17",
  uid: "11111111-1111-1111-1111-111111111111",
  cashboxData: {
    cashbox: "4000438533",
    tin: 44657555,
    name: "ТОВ ТЕСТ ПРРО",
    pointName: "кафе Ромашка",
    pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
    cashboxLocalNumber: "123",
    nextDocumentNumber: 1,
    isOffline: true,
    isTestingMode: true,
    offlineSessionData: {
      id: 23649865,
      seed: 135969449201653,
      nextOfflineDocumentNumber: 1,
      lastDocumentHash:
        "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
    },
  },
  cashier: "Шевченко Т.Г.",
};
