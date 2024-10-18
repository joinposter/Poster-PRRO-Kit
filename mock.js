import defaultReceiptConfig from "./modules/receiptGenerator/config/receipt.js";

export const cashboxData = {
  cashbox: 4000244601,
  tin: "12345678",
  ipn: "",
  name: "ТОВ ТЕСТ ПРРО",
  pointName: 'Кафе "Мʼята"',
  pointAddress:
    "Дніпропетровська область, м. Дніпро, Амур-Нижньодніпровський район, вул. Шолом-Алейхема, 4, кв. (Офіс) 31",
  cashboxLocalNumber: "123",
  isOffline: false,
  isTestingMode: false,
  shiftNumber: 1,
};
export const getServiceInputBodyMock = {
  sum: 285000,
  dateTime: "2024-05-16T16:28:35.679Z",
  receiptConfig: defaultReceiptConfig,
  cashboxData,
  cashier: "Шевченко Т.Г.",
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextDocumentNumber: 2834,
    nextOfflineDocumentNumber: 4,
    lastDocumentHash:
      "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
  },
};

export const getServiceOutputBodyMock = {
  sum: -75000,
  dateTime: "2024-05-16T16:28:35.679Z",
  receiptConfig: defaultReceiptConfig,
  cashboxData,
  cashier: "Шевченко Т.Г.",
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextDocumentNumber: 2834,
    nextOfflineDocumentNumber: 4,
    lastDocumentHash:
      "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
  },
};

export const productsData = [
  {
    barcodes: ["12345678"],
    marking: ["ADCC123123"],
    name: "2204109600#Вино игристое вкусное",
    count: 2000,
    price: 13002,
    taxPrograms: "ДГ",
    discount: 1004,
  },
  {
    barcodes: null,
    marking: null,
    name: "2204888600#Сир",
    count: 4000,
    price: 26000,
    taxPrograms: "Д",
  },
  {
    barcodes: null,
    marking: null,
    name: "Сирна палочка",
    count: 1000,
    price: 500,
    taxPrograms: "Д",
  },
];

export const productsDataInCentsAndGrams = [
  {
    barcodes: ["12345678"],
    marking: ["ADCC123123"],
    name: "2204109600#Вино игристое вкусное",
    count: 2000,
    price: 13002,
    taxPrograms: "ДГ",
    discount: 1004,
  },
  {
    barcodes: null,
    marking: null,
    name: "2204888600#Сир",
    count: 4000,
    price: 26000,
    taxPrograms: "Д",
  },
  {
    barcodes: null,
    marking: null,
    name: "Сирна палочка",
    count: 1000,
    price: 500,
    taxPrograms: "Д",
  },
];

export const sstData = {
  adv: "ПриватБанк.",
  adv2p: "Беремо i робимо!",
  allResponses: { 2957: {} },
  amount: "1.68",
  applicationId: 2957,
  approvalCode: "159345",
  authCode: "159345",
  bankAcquirer: "ПриватБанк",
  captureReference: "",
  cardExpiryDate: "2709",
  date: "27.05.2024",
  deviceClass: "platformPayTerminal",
  deviceId: "2957_1171759599",
  discount: "0.00",
  fiscal_company_uuid: null,
  hstFld63Sf89: "",
  invoiceNumber: "1923984010",
  issuerName: "Visa Credit",
  merchant: "S1260S6Y",
  merchantId: "ПриватБанк",
  operationType: 1,
  pan: "4422********6333",
  paymentSystem: "VISA",
  paymentSystemName: "VISA",
  posConditionCode: "00",
  posEntryMode: "071",
  processingCode: "000000",
  receipt: "",
  receiptId: 1716822579300,
  responseCode: "0000",
  rrn: "083998389823",
  rrnExt: "414815005125",
  signVerif: "0",
  signVerify: "0",
  success: true,
  terminalId: "S1260S6Y",
  time: "18:10:12",
  track1: "",
  trnStatus: "1",
  txnType: "1",
};

export const alternativeSstData = {
  paymentSystemName: "MasterCard",
  authCode: "400035",
  merchantId: "S1K70F0U",
  success: true,
  error_code: 0,
  operationType: 1,
  terminalId: "S1K70F0U",
  pan: "XXXXXXXXXXXX1935",
  signVerify: 0,
  transactionId: 6930,
  rrn: "085875832176",
  saveCallback: false,
  receiptId: 1721218830342,
  deviceId: "192.168.0.103",
  deviceClass: "ingenicoUa",
  fiscal_company_uuid: null,
  status: 0,
  fiscal_company_id: null,
};

export const fiscalReceiptDataMock = {
  type: "receipt",
  fiscalId: "2462757750",
  dateTime: "2024-05-16T16:29:35.710Z",
  cashbox: cashboxData.cashbox,
  cashboxData,
  cashier: "Шевченко Т.Г.",
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextDocumentNumber: 2834,
    nextOfflineDocumentNumber: 4,
    lastDocumentHash:
      "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
  },
  total: 38426,
  payments: [
    {
      sum: 28430,
      type: "cash",
    },
    {
      sum: 9996,
      type: "card",
    },
  ],
  products: productsData,
  taxes: [
    {
      type: 5,
      name: "Акциз 5%",
      percent: 5,
      sum: 1829,
      turnover: 38426,
      sourceSum: 0,
      program: "Д",
    },
    {
      type: 4,
      name: "ПДВ 20%",
      percent: 20,
      sum: 2925,
      turnover: 18426,
      sourceSum: 0,
      program: "Г",
    },
  ],
  headerServiceData: [
    { name: "Чек №", value: 485 },
    { name: "Тип замовлення", value: "У закладі" },
    { name: "Відкрито", value: "16 липня 2024 19:29:35" },
    { name: "Надруковано", value: "16 липня 2024 19:30:35" },
    { name: "Стіл №", value: "6 (Основний зал)" },
    { name: "К-сть гостей", value: "2" },
  ],
  footerServiceData: "На вас чекає приємний сюрприз!",
  sstData,
  fiscalLink: "https://d.fiscalservice.gov.ua/receipt/12345678",
};

export const xReportDataMock = {
  type: "XReport",
  realiz: {
    sum: 268180,
    receiptCount: 31,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 202080,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 66100,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 12754,
        turnover: 268160,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 2331,
        turnover: 37604,
        sourceSum: 0,
        program: "В",
      },
      {
        type: 4,
        name: "ПДВ",
        percent: 20,
        sum: 17550,
        turnover: 110556,
        sourceSum: 0,
        program: "Г",
      },
    ],
  },
  return: {
    sum: 3100,
    receiptCount: 2,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 3000,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 100,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 147,
        turnover: 3104,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 192,
        turnover: 3104,
        sourceSum: 0,
        program: "В",
      },
    ],
  },
  serviceInput: null,
  serviceOutput: null,
  cashboxData,
  shiftOpenData: {
    dateTime: "2024-05-24T13:20:05.407Z",
    balance: 0,
  },
  lastFiscalDocumentData: {
    dateTime: "2024-05-27T17:22:06.973Z",
    documentNumber: 516,
    fiscalId: "2469255615",
  },
  dateTime: "2024-05-27T17:22:06.973Z",
  cashier: "Шевченко Т.Г.",
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextDocumentNumber: 2834,
    nextOfflineDocumentNumber: 4,
    lastDocumentHash:
      "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
  },
  isCashboxModeOffline: true,
  documentNumber: 1,
  offlineDocumentNumber: 1,
  previousDocumentHash:
    "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
};

export const zReportDataMock = {
  type: "ZReport",
  realiz: {
    sum: 268180,
    receiptCount: 31,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 202080,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 66100,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 12754,
        turnover: 268160,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 2331,
        turnover: 37604,
        sourceSum: 0,
        program: "В",
      },
      {
        type: 4,
        name: "ПДВ",
        percent: 20,
        sum: 17550,
        turnover: 110556,
        sourceSum: 0,
        program: "Г",
      },
    ],
  },
  return: {
    sum: 3100,
    receiptCount: 2,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 3000,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 100,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 147,
        turnover: 3104,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 192,
        turnover: 3104,
        sourceSum: 0,
        program: "В",
      },
    ],
  },
  serviceInput: { sum: 10000 },
  serviceOutput: { sum: -20000 },
  cashboxData,
  shiftOpenData: {
    dateTime: "2024-05-24T13:20:05.407Z",
    balance: 0,
  },
  lastFiscalDocumentData: {
    dateTime: "2024-05-27T17:22:06.973Z",
    documentNumber: 516,
    fiscalId: "2469255615",
  },
  dateTime: "2024-05-27T17:22:06.973Z",
  cashier: "Шевченко Т.Г.",
  offlineSessionData: {
    id: 23649865,
    seed: 135969449201653,
    nextDocumentNumber: 2834,
    nextOfflineDocumentNumber: 4,
    lastDocumentHash:
      "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
  },
  isCashboxModeOffline: true,
  documentNumber: 1,
  offlineDocumentNumber: 1,
  previousDocumentHash:
    "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
};
