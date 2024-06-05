import defaultReceiptConfig from "./modules/receiptGenerator/config/receipt.js";

export const cashboxData = {
  isOffline: false,
  dateTime: "2024-05-24T13:20:02.357Z",
  name: "ТОВ ТЕСТ ПРРО",
  pointName: 'Кафе "Мʼята"',
  pointAddress:
    "Дніпропетровська область, м. Дніпро, Амур-Нижньодніпровський район, вул. Шолом-Алейхема, 4, кв. (Офіс) 31",
  tin: "12345678",
  cashbox: "4000244601",
};
export const getServiceInputBodyMock = {
  sum: 2850,
  dateTime: "2024-05-16T16:28:35.679Z",
  receiptConfig: defaultReceiptConfig,
  cashboxData,
};

export const getServiceOutputBodyMock = {
  sum: -750,
  dateTime: "2024-05-16T16:28:35.679Z",
  receiptConfig: defaultReceiptConfig,
  cashboxData,
};

export const productsData = [
  {
    barcodes: ["12345678"],
    marking: ["ADCC123123"],
    name: "2204109600#Вино игристое вкусное",
    count: 2,
    price: 130.02,
    taxPrograms: "ДГ",
  },
  {
    barcodes: null,
    marking: null,
    name: "2204888600#Сир",
    count: 4,
    price: 260,
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

export const fiscalReceiptDataMock = {
  cashboxData,
  fiscalId: "2462757750",
  type: "receipt",
  cashbox: cashboxData.cashbox,
  total: 384.26,
  payments: [
    {
      sum: 284.26,
      type: "cash",
    },
    {
      sum: 100,
      type: "card",
    },
  ],
  products: productsData,
  uid: "587989ce-f05d-4d66-b2a8-4138f13bfe88",
  dateTime: "2024-05-16T16:29:35.710Z",
  taxes: [
    {
      type: 5,
      name: "Акциз 5%",
      percent: 5,
      sum: 18.29,
      turnover: 384.26,
      sourceSum: 0,
      program: "Д",
    },
    {
      type: 4,
      name: "ПДВ 20%",
      percent: 20,
      sum: 29.25,
      turnover: 184.26,
      sourceSum: 0,
      program: "Г",
    },
  ],
  sstData,
};

export const xReportDataMock = {
  type: "XReport",
  realiz: {
    sum: 2681.7999999999997,
    receiptCount: 31,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 2020.8,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 661,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 127.54,
        turnover: 2681.6,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 23.31,
        turnover: 376.04,
        sourceSum: 0,
        program: "В",
      },
      {
        type: 4,
        name: "ПДВ",
        percent: 20,
        sum: 175.5,
        turnover: 1105.56,
        sourceSum: 0,
        program: "Г",
      },
    ],
  },
  return: {
    sum: 31,
    receiptCount: 2,
    payments: [
      {
        payFormCode: 0,
        payFormName: "ГОТІВКА",
        sum: 30,
      },
      {
        payFormCode: 1,
        payFormName: "КАРТКА",
        sum: 1,
      },
    ],
    taxes: [
      {
        type: 5,
        name: "Акцизний податок",
        percent: 5,
        sum: 1.47,
        turnover: 31.04,
        sourceSum: 0,
        program: "Д",
      },
      {
        type: 3,
        name: "ПДВ",
        percent: 7,
        sum: 1.92,
        turnover: 31.04,
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
  },
  lastFiscalDocumentData: {
    dateTime: "2024-05-27T17:22:06.973Z",
    documentNumber: 516,
    fiscalId: "2469255615",
  },
  dateTime: "2024-05-27T17:22:06.973Z",
};
