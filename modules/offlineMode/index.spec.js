import { v4 as uuidv4 } from "uuid";
import { mockCustomTaxes } from "../taxes/mock/taxes.js";
import {
  getReceiptOfflineModeRequestData,
  getTransactionOfflineModeRequestData,
  getZReportOfflineModeRequestData,
  getOpenShiftOfflineModeRequestData,
  getCloseShiftOfflineModeRequestData,
  getStartOfflineModeRequestData,
  getFinishOfflineModeRequestData,
  mergeOperationsAndXReport,
} from "./index.js";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));
describe("offline mode", () => {
  beforeAll(() => {
    const fakeUUID = "11111111-1111-1111-1111-111111111111";
    uuidv4.mockImplementation(() => fakeUUID);
  });
  it("getReceiptOfflineModeRequestData", async () => {
    expect(
      await getReceiptOfflineModeRequestData({
        type: "receipt",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          ipn: "",
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          isTestingMode: true,
          isOffline: true,
          nextDocumentNumber: 2828,
          offlineSessionData: {
            id: "23649865",
            seed: "135969449201653",
            nextOfflineDocumentNumber: 1,
            lastDocumentHash:
              "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
          },
        },
        cashier: "Шевченко Т.Г.",
        total: 95004,
        payments: [
          { sum: 10000, type: "cash" },
          { sum: 85004, type: "card" },
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
          },
          {
            id: 55,
            name: "Морозиво",
            count: 2000,
            unit: "шт",
            price: 9013,
            discount: 2000,
            taxPrograms: "БД",
          },
          {
            id: 56,
            name: "Кава",
            count: 1000,
            unit: "шт",
            price: 2013,
            discount: 35,
            taxPrograms: "В",
          },
        ],
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
        taxesConfig: mockCustomTaxes,
      }),
    ).toEqual({
      type: "receipt",
      fiscalId: "23649865.1.1236",
      fiscalLink:
        "https://cabinet.tax.gov.ua/cashregs/check?id=23649865.1.1236&date=20240604&time=152618&fn=4000438533&sm=950.04&mac=47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        name: "ТОВ ТЕСТ ПРРО",
        pointName: "кафе Ромашка",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        cashboxLocalNumber: "123",
        ipn: "",
        isOffline: true,
        isTestingMode: true,
        nextDocumentNumber: 2828,
        offlineSessionData: {
          id: "23649865",
          seed: "135969449201653",
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      total: 95004,
      payments: [
        {
          sum: 10000,
          type: "cash",
        },
        {
          sum: 85004,
          type: "card",
        },
      ],
      products: [
        {
          count: 4000,
          discount: 3000,
          id: 54,
          name: "Сирна паличка",
          price: 20000,
          taxPrograms: "ГД",
          unit: "шт",
        },
        {
          count: 2000,
          discount: 2000,
          id: 55,
          name: "Морозиво",
          price: 9013,
          taxPrograms: "БД",
          unit: "шт",
        },
        {
          count: 1000,
          discount: 35,
          id: 56,
          name: "Кава",
          price: 2013,
          taxPrograms: "В",
          unit: "шт",
        },
      ],
      taxes: [
        {
          name: "Акциз",
          percent: 5,
          program: "Д",
          sourceSum: 93026,
          sum: 4430,
          turnover: 98026,
          type: 1,
        },
        {
          name: "ПДВ 0%",
          percent: 0,
          program: "Г",
          sourceSum: 73333,
          sum: 0,
          turnover: 80000,
          type: 0,
        },
        {
          name: "ПДВ 7%",
          percent: 7,
          program: "Б",
          sourceSum: 15263,
          sum: 999,
          turnover: 18026,
          type: 0,
        },
        {
          name: "ПДВ 20%",
          percent: 20,
          program: "В",
          sourceSum: 1978,
          sum: 330,
          turnover: 2013,
          type: 0,
        },
      ],
    });
  });
  it("getReceiptOfflineModeRequestData in cents and grams format", async () => {
    expect(
      await getReceiptOfflineModeRequestData({
        type: "receipt",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          ipn: "",
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          isTestingMode: true,
          isOffline: true,
          nextDocumentNumber: 2828,
          offlineSessionData: {
            id: "23649865",
            seed: "135969449201653",
            nextOfflineDocumentNumber: 1,
            lastDocumentHash:
              "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
          },
        },
        cashier: "Шевченко Т.Г.",
        total: 95004,
        payments: [
          { sum: 10000, type: "cash" },
          { sum: 85004, type: "card" },
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
          },
          {
            id: 55,
            name: "Морозиво",
            count: 2000,
            unit: "шт",
            price: 9013,
            discount: 2000,
            taxPrograms: "БД",
          },
          {
            id: 56,
            name: "Кава",
            count: 1000,
            unit: "шт",
            price: 2013,
            discount: 35,
            taxPrograms: "В",
          },
        ],
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
        taxesConfig: mockCustomTaxes,
      }),
    ).toEqual({
      type: "receipt",
      fiscalId: "23649865.1.1236",
      fiscalLink:
        "https://cabinet.tax.gov.ua/cashregs/check?id=23649865.1.1236&date=20240604&time=152618&fn=4000438533&sm=950.04&mac=47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        name: "ТОВ ТЕСТ ПРРО",
        pointName: "кафе Ромашка",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        cashboxLocalNumber: "123",
        ipn: "",
        isOffline: true,
        isTestingMode: true,
        nextDocumentNumber: 2828,
        offlineSessionData: {
          id: "23649865",
          seed: "135969449201653",
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "47a08c017274237765f9081d994e76e08742dcef85056d655a8458ec43dff6e4",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      total: 95004,
      payments: [
        {
          sum: 10000,
          type: "cash",
        },
        {
          sum: 85004,
          type: "card",
        },
      ],
      products: [
        {
          count: 4000,
          discount: 3000,
          id: 54,
          name: "Сирна паличка",
          price: 20000,
          taxPrograms: "ГД",
          unit: "шт",
        },
        {
          count: 2000,
          discount: 2000,
          id: 55,
          name: "Морозиво",
          price: 9013,
          taxPrograms: "БД",
          unit: "шт",
        },
        {
          count: 1000,
          discount: 35,
          id: 56,
          name: "Кава",
          price: 2013,
          taxPrograms: "В",
          unit: "шт",
        },
      ],
      taxes: [
        {
          name: "Акциз",
          percent: 5,
          program: "Д",
          sourceSum: 93026,
          sum: 4430,
          turnover: 98026,
          type: 1,
        },
        {
          name: "ПДВ 0%",
          percent: 0,
          program: "Г",
          sourceSum: 73333,
          sum: 0,
          turnover: 80000,
          type: 0,
        },
        {
          name: "ПДВ 7%",
          percent: 7,
          program: "Б",
          sourceSum: 15263,
          sum: 999,
          turnover: 18026,
          type: 0,
        },
        {
          name: "ПДВ 20%",
          percent: 20,
          program: "В",
          sourceSum: 1978,
          sum: 330,
          turnover: 2013,
          type: 0,
        },
      ],
    });
  });

  it("getTransactionOfflineModeRequestData", async () => {
    expect(
      await getTransactionOfflineModeRequestData({
        type: "serviceEntry",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          nextDocumentNumber: 1,
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
        sum: 100000,
      }),
    ).toEqual({
      type: "serviceEntry",
      fiscalId: "23649865.1.4646",
      fiscalLink:
        "https://cabinet.tax.gov.ua/cashregs/check?id=23649865.1.4646&date=20240604&time=152618&fn=4000438533&sm=1000&mac=685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        name: "ТОВ ТЕСТ ПРРО",
        pointName: "кафе Ромашка",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        cashboxLocalNumber: "123",
        isTestingMode: true,
        isOffline: true,
        nextDocumentNumber: 1,
        offlineSessionData: {
          id: 23649865,
          seed: 135969449201653,
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      sum: 1000,
    });
  });
  it("getOpenShiftOfflineModeRequestData", async () => {
    expect(
      await getOpenShiftOfflineModeRequestData({
        type: "shiftOpen",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          nextDocumentNumber: 1,
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      }),
    ).toEqual({
      type: "shiftOpen",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
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
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
    });
  });
  it("getCloseShiftOfflineModeRequestData", async () => {
    expect(
      await getCloseShiftOfflineModeRequestData({
        type: "shiftClose",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          nextDocumentNumber: 1,
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      }),
    ).toEqual({
      type: "shiftClose",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
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
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
    });
  });
  it.skip("getZReportOfflineModeRequestData", async () => {
    const data = [
      {
        cashbox: 4000847239,
        type: "shiftOpen",
        uid: "d4d97788-a770-4110-a978-632e31060356",
        dateTime: "2024-06-05T10:29:32.890Z",
        documentNumber: 786,
      },
      {
        type: "receipt",
        cashbox: 4000847239,
        dateTime: "2024-06-05T10:29:37.624Z",
        total: 23,
        payments: [
          {
            sum: 10,
            type: "card",
          },
          {
            sum: 13,
            type: "cash",
          },
        ],
        products: [
          {
            count: 1,
            discount: 0,
            id: 7,
            name: "Паштейш",
            price: 18,
            roundSum: 0,
            tax: 8,
            taxName: "Без ПДВ + Акциз 5%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: [],
            taxPrograms: "ЖЗ",
          },
          {
            count: 1,
            discount: 0,
            id: 54,
            name: "Сирна паличка",
            price: 5,
            roundSum: 0,
            tax: 8,
            taxName: "Без ПДВ + Акциз 5%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: [],
            taxPrograms: "ЖЗ",
          },
        ],
        sstData: false,
        cashier: "Maksym",
        uid: "3096ab29-6ce4-42f5-8131-802e58755ca7",
        taxes: [
          {
            sum: 1.1,
            turnover: 23,
            sourceSum: 0,
            program: "З",
            type: 9,
            name: "Акциз",
            percent: 5,
          },
          {
            sum: 0,
            turnover: 23,
            sourceSum: 0,
            program: "Ж",
            type: 8,
            name: "Без ПДВ + Акциз 5%",
            percent: 0,
          },
        ],
        documentNumber: 787,
      },
      {
        type: "receipt",
        cashbox: 4000847239,
        dateTime: "2024-06-05T10:29:49.338Z",
        total: 16.04,
        payments: [
          {
            sum: 1,
            type: "card",
          },
          {
            sum: 15.04,
            type: "cash",
          },
        ],
        products: [
          {
            count: 1,
            discount: 0,
            id: 20,
            name: "Сітро (0.5л)",
            price: 15,
            roundSum: 0.04,
            tax: 4,
            taxName: "ПДВ 0%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: [],
            taxPrograms: "Г",
          },
          {
            count: 1,
            discount: 0,
            id: 49,
            name: "2204109600#Pepsi (0.5л)",
            price: 1.04,
            roundSum: 0,
            tax: 3,
            taxName: "ПДВ 20% + Акциз 5%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: ["1234567890123"],
            taxPrograms: "ВД",
          },
        ],
        sstData: false,
        cashier: "Maksym",
        uid: "0b649c87-ca32-4cf0-bba5-0e6d36996fc1",
        taxes: [
          {
            sum: 0,
            turnover: 15,
            sourceSum: 0,
            program: "Г",
            type: 4,
            name: "ПДВ 0%",
            percent: 0,
          },
          {
            sum: 0.05,
            turnover: 1.04,
            sourceSum: 0,
            program: "Д",
            type: 5,
            name: "Акциз",
            percent: 5,
          },
          {
            sum: 0.17,
            turnover: 1.04,
            sourceSum: 0,
            program: "В",
            type: 3,
            name: "ПДВ 20% + Акциз 5%",
            percent: 20,
          },
        ],
        documentNumber: 788,
      },
      {
        type: "returnReceipt",
        cashbox: 4000847239,
        dateTime: "2024-06-05T10:29:57.160Z",
        total: 16.04,
        payments: [
          {
            sum: 1,
            type: "card",
          },
          {
            sum: 15.04,
            type: "cash",
          },
        ],
        products: [
          {
            count: 1,
            discount: 0,
            id: 20,
            name: "Сітро (0.5л)",
            price: 15,
            roundSum: 0.04,
            tax: 4,
            taxName: "ПДВ 0%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: [],
            taxPrograms: "Г",
          },
          {
            count: 1,
            discount: 0,
            id: 49,
            name: "2204109600#Pepsi (0.5л)",
            price: 1.04,
            roundSum: 0,
            tax: 3,
            taxName: "ПДВ 20% + Акциз 5%",
            taxType: 1,
            promotionId: 0,
            modificationId: 0,
            isWeight: 0,
            marking: [],
            barcodes: ["1234567890123"],
            taxPrograms: "ВД",
          },
        ],
        sstData: false,
        cashier: "Maksym",
        documentFiscalId: "2507944945",
        uid: "e7d179eb-55ca-4c9a-b6cc-8feb9a937a15",
        taxes: [
          {
            sum: 0,
            turnover: 15,
            sourceSum: 0,
            program: "Г",
            type: 4,
            name: "ПДВ 0%",
            percent: 0,
          },
          {
            sum: 0.05,
            turnover: 1.04,
            sourceSum: 0,
            program: "Д",
            type: 5,
            name: "Акциз",
            percent: 5,
          },
          {
            sum: 0.17,
            turnover: 1.04,
            sourceSum: 0,
            program: "В",
            type: 3,
            name: "ПДВ 20% + Акциз 5%",
            percent: 20,
          },
        ],
        documentNumber: 789,
      },
    ];
    expect(
      await getZReportOfflineModeRequestData({
        type: "ZReport",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData: {
          cashbox: "4000438533",
          tin: 44657555,
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashboxLocalNumber: "123",
          nextDocumentNumber: 1,
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
        ZReportData: data,
        lastFiscalDocument: {
          documentNumber: 789,
          fiscalId: "2507944945",
          request: {
            dateTime: "2024-06-04T12:30:18.293Z",
          },
        },
        taxesConfig: mockCustomTaxes,
      }),
    ).toEqual({
      type: "ZReport",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      fiscalId: "23649865.1.9535",
      lastFiscalDocumentData: {
        dateTime: "2024-06-04T12:30:18.293Z",
        documentNumber: 789,
        fiscalId: "2507944945",
      },
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        name: "ТОВ ТЕСТ ПРРО",
        pointName: "кафе Ромашка",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        cashboxLocalNumber: "123",
        isOffline: true,
        isTestingMode: true,
        nextDocumentNumber: 1,
        offlineSessionData: {
          id: 23649865,
          seed: 135969449201653,
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      realiz: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 28,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 11,
          },
        ],
        receiptCount: 2,
        sum: 39,
        taxes: [
          {
            name: "Акциз",
            percent: 5,
            program: "З",
            sourceSum: 0,
            sum: 1.1,
            turnover: 23,
            type: 9,
          },
          {
            name: "Без ПДВ + Акциз 5%",
            percent: 0,
            program: "Ж",
            sourceSum: 0,
            sum: 0,
            turnover: 23,
            type: 8,
          },
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 0,
            sum: 0,
            turnover: 15,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 0,
            sum: 0.05,
            turnover: 1.04,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 0,
            sum: 0.17,
            turnover: 1.04,
            type: 3,
          },
        ],
      },
      return: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 15,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 1,
          },
        ],
        receiptCount: 1,
        sum: 16,
        taxes: [
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 0,
            sum: 0,
            turnover: 15,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 0,
            sum: 0.05,
            turnover: 1.04,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 0,
            sum: 0.17,
            turnover: 1.04,
            type: 3,
          },
        ],
      },
      serviceInput: null,
      serviceOutput: null,
    });
  });
  it("getStartOfflineModeRequestData", async () => {
    expect(
      await getStartOfflineModeRequestData({
        type: "offlineStart",
        dateTime: "2024-06-04T12:26:18.293Z",
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      }),
    ).toEqual({
      type: "offlineStart",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
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
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
    });
  });
  it("getFinishOfflineModeRequestData", async () => {
    expect(
      await getFinishOfflineModeRequestData({
        type: "offlineFinish",
        dateTime: "2024-06-04T12:26:18.293Z",
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
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      }),
    ).toEqual({
      type: "offlineFinish",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        isOffline: true,
        isTestingMode: true,
        nextDocumentNumber: 1,
        offlineSessionData: {
          id: 23649865,
          seed: 135969449201653,
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
    });
  });
  it.skip("mergeOperationsAndXReport", async () => {
    const receiptOperation = {
      type: "receipt",
      dateTime: "2024-06-04T12:26:18.293Z",
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
      fiscalId: "23649865.1.4646",
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      total: 95004,
      payments: [
        { sum: 10000, type: "cash" },
        { sum: 85004, type: "card" },
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
        },
        {
          id: 55,
          name: "Морозиво",
          count: 2000,
          unit: "шт",
          price: 9013,
          discount: 2000,
          taxPrograms: "БД",
        },
        {
          id: 56,
          name: "Кава",
          count: 1000,
          unit: "шт",
          price: 2013,
          discount: 35,
          taxPrograms: "В",
        },
      ],
      taxesConfig: mockCustomTaxes,
    };
    const serviceEntryOperation = {
      type: "serviceEntry",
      dateTime: "2024-06-04T12:26:18.293Z",
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
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      sum: 1000,
    };
    const serviceDeliveryOperation = {
      type: "serviceDelivery",
      dateTime: "2024-06-04T12:36:18.293Z",
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        ipn: "",
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
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      sum: 900,
    };
    const returnOperation = {
      type: "returnReceipt",
      dateTime: "2024-06-05T10:29:57.160Z",
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
      fiscalId: "2507944945",
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      total: 1604,
      payments: [
        {
          sum: 1604,
          type: "cash",
        },
      ],
      products: [
        {
          count: 1000,
          discount: 0,
          id: 20,
          name: "Сітро (0.5л)",
          price: 1500,
          roundSum: 4,
          tax: 4,
          taxName: "ПДВ 0%",
          taxType: 1,
          promotionId: 0,
          modificationId: 0,
          isWeight: 0,
          marking: [],
          barcodes: [],
          taxPrograms: "Г",
        },
        {
          count: 1000,
          discount: 0,
          id: 49,
          name: "2204109600#Pepsi (0.5л)",
          price: 104,
          roundSum: 0,
          tax: 3,
          taxName: "ПДВ 20% + Акциз 5%",
          taxType: 1,
          promotionId: 0,
          modificationId: 0,
          isWeight: 0,
          marking: [],
          barcodes: ["1234567890123"],
          taxPrograms: "ВД",
        },
      ],
      taxesConfig: mockCustomTaxes,
    };
    const xReport = {
      type: "XReport",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "1111111111111111111111111111111111111111111111111111111111111111",
      fiscalId: "23649865.1.9535",
      lastFiscalDocumentData: {
        dateTime: "2024-06-04T12:30:18.293Z",
        documentNumber: 789,
        fiscalId: "2507944945",
      },
      cashboxData: {
        cashbox: "4000438533",
        tin: 44657555,
        name: "ТОВ ТЕСТ ПРРО",
        pointName: "кафе Ромашка",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        cashboxLocalNumber: "123",
        nextDocumentNumber: 1,
        isOffline: true,
        offlineSessionData: {
          id: 23649865,
          seed: 135969449201653,
          nextOfflineDocumentNumber: 1,
          lastDocumentHash:
            "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        },
      },
      cashier: "Шевченко Т.Г.",
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
      realiz: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 2800,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 1100,
          },
        ],
        receiptCount: 2,
        sum: 3900,
        taxes: [
          {
            name: "Акциз",
            percent: 5,
            program: "З",
            sourceSum: 0,
            sum: 110,
            turnover: 230,
            type: 9,
          },
          {
            name: "Без ПДВ + Акциз 5%",
            percent: 0,
            program: "Ж",
            sourceSum: 0,
            sum: 0,
            turnover: 2300,
            type: 8,
          },
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 0,
            sum: 0,
            turnover: 15,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 0,
            sum: 5,
            turnover: 104,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 0,
            sum: 17,
            turnover: 104,
            type: 3,
          },
        ],
      },
      return: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 1500,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 100,
          },
        ],
        receiptCount: 1,
        sum: 1600,
        taxes: [
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 0,
            sum: 0,
            turnover: 1500,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 0,
            sum: 5,
            turnover: 104,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 0,
            sum: 17,
            turnover: 104,
            type: 3,
          },
        ],
      },
      serviceInput: null,
      serviceOutput: null,
    };
    expect(
      await mergeOperationsAndXReport({
        operations: [
          receiptOperation,
          serviceEntryOperation,
          serviceDeliveryOperation,
          returnOperation,
        ],
        xReport,
        taxesConfig: mockCustomTaxes,
      }),
    ).toEqual({
      lastFiscalDocumentData: {
        dateTime: "2024-06-05T10:29:57.160Z",
        documentNumber: 1,
        fiscalId: "2507944945",
      },
      realiz: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 12800,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 86104,
          },
        ],
        receiptCount: 3,
        sum: 98904,
        taxes: [
          {
            name: "Акциз",
            percent: 5,
            program: "З",
            sourceSum: 0,
            sum: 110,
            turnover: 2300,
            type: 9,
          },
          {
            name: "Без ПДВ + Акциз 5%",
            percent: 0,
            program: "Ж",
            sourceSum: 0,
            sum: 0,
            turnover: 2300,
            type: 8,
          },
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 73333,
            sum: 0,
            turnover: 81500,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 93026,
            sum: 4435,
            turnover: 98130,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 1978,
            sum: 347,
            turnover: 2117,
            type: 3,
          },
          {
            name: "ПДВ 7%",
            percent: 7,
            program: "Б",
            sourceSum: 15263,
            sum: 999,
            turnover: 18026,
            type: 2,
          },
        ],
      },
      return: {
        payments: [
          {
            payFormCode: 0,
            payFormName: "ГОТІВКА",
            sum: 3104,
          },
          {
            payFormCode: 1,
            payFormName: "КАРТКА",
            sum: 100,
          },
        ],
        receiptCount: 2,
        sum: 3200,
        taxes: [
          {
            name: "ПДВ 0%",
            percent: 0,
            program: "Г",
            sourceSum: 1500,
            sum: 0,
            turnover: 3000,
            type: 4,
          },
          {
            name: "Акциз",
            percent: 5,
            program: "Д",
            sourceSum: 104,
            sum: 10,
            turnover: 208,
            type: 5,
          },
          {
            name: "ПДВ 20%",
            percent: 20,
            program: "В",
            sourceSum: 99,
            sum: 34,
            turnover: 208,
            type: 3,
          },
        ],
      },
      serviceInput: 1000,
      serviceOutput: 900,
      shiftOpenData: {
        dateTime: "2024-06-04T10:26:18.293Z",
      },
    });
  });
});
