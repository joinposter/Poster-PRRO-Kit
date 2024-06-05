import { cashboxData } from "./mock/data.js";
import { mockCustomTaxes } from "../taxes/mock/taxes.js";
import {
  generateOfflineReceiptDocument,
  generateOfflineTransactionDocument,
  generateOfflineOpenShiftDocument,
  generateOfflineCloseShiftDocument,
  generateOfflineZReportDocument,
  generateOfflineStartDocument,
  generateOfflineFinishDocument,
} from "./index.js";

describe("offline mode", () => {
  it("generateOfflineReceiptDocument should return all data for generation receipt", () => {
    expect(
      generateOfflineReceiptDocument({
        type: "receipt",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
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
        taxesConfig: mockCustomTaxes,
      }),
    ).toEqual({
      type: "receipt",
      fiscalId: "23649865.1.6334",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "413b477e666aabcf3017f53144a92bffa8e3590d6c13d4490498fe66cf40d92a",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
      total: 950.04,
      payments: [
        {
          sum: 100,
          type: "cash",
        },
        {
          sum: 850.04,
          type: "card",
        },
      ],
      products: [
        {
          count: 4,
          discount: 30,
          id: 54,
          name: "Сирна паличка",
          price: 200,
          taxPrograms: "ГД",
          unit: "шт",
        },
        {
          count: 2,
          discount: 20,
          id: 55,
          name: "Морозиво",
          price: 90.13,
          taxPrograms: "БД",
          unit: "шт",
        },
        {
          count: 1,
          discount: 0.35,
          id: 56,
          name: "Кава",
          price: 20.13,
          taxPrograms: "В",
          unit: "шт",
        },
      ],
      taxes: [
        {
          name: "Акциз",
          percent: 5,
          program: "Д",
          sourceSum: 930.26,
          sum: 44.3,
          turnover: 980.26,
          type: 5,
        },
        {
          name: "ПДВ 0%",
          percent: 0,
          program: "Г",
          sourceSum: 770,
          sum: 0,
          turnover: 800,
          type: 4,
        },
        {
          name: "ПДВ 7%",
          percent: 7,
          program: "Б",
          sourceSum: 160.26,
          sum: 9.99,
          turnover: 180.26,
          type: 2,
        },
        {
          name: "ПДВ 20%",
          percent: 20,
          program: "В",
          sourceSum: 19.78,
          sum: 3.3,
          turnover: 20.13,
          type: 3,
        },
      ],
    });
  });
  it("generateOfflineTransactionDocument should return all data for generation receipt", () => {
    expect(
      generateOfflineTransactionDocument({
        type: "serviceEntry",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
        sum: 1000,
      }),
    ).toEqual({
      type: "serviceEntry",
      fiscalId: "23649865.1.4646",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "e41c5500348526fa3da0623615e1948719f02810f64ffa75080bdc13eb1ae501",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
      sum: 1000,
    });
  });
  it("generateOfflineOpenShiftDocument should return all data for generation receipt", () => {
    expect(
      generateOfflineOpenShiftDocument({
        type: "shiftOpen",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
      }),
    ).toEqual({
      type: "shiftOpen",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "fcd904eba8c1d0baf0b639374618eb833e84e862a10a13973d9c42e53c34aa3e",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
    });
  });
  it("generateOfflineCloseShiftDocument should return all data for generation receipt", () => {
    expect(
      generateOfflineCloseShiftDocument({
        type: "shiftClose",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
      }),
    ).toEqual({
      type: "shiftClose",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "7d4ce6a380cb8a91b40a26c294e0cfd1846dc26269599ffebde338f96261ec7e",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
    });
  });
  it("generateOfflineZReportDocument should return all data for generation receipt", () => {
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
      generateOfflineZReportDocument({
        type: "ZReport",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
        data,
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
        "06accf0d0bf40e8181538deebf978506794d1d00b3310706f245c9e039327ad1",
      fiscalId: "23649865.1.9535",
      lastFiscalDocumentData: {
        dateTime: "2024-06-04T12:30:18.293Z",
        documentNumber: 789,
        fiscalId: "2507944945",
      },
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
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
  it("generateOfflineStartDocument", () => {
    expect(
      generateOfflineStartDocument({
        type: "offlineStart",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
      }),
    ).toEqual({
      type: "offlineStart",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "489dafef259874ac2c4c2f19bdb245adefa407a16d63e83ba11100d8595017cc",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
    });
  });
  it("generateOfflineFinishDocument", () => {
    expect(
      generateOfflineFinishDocument({
        type: "offlineFinish",
        dateTime: "2024-06-04T12:26:18.293Z",
        cashboxData,
      }),
    ).toEqual({
      type: "offlineFinish",
      uid: "11111111-1111-1111-1111-111111111111",
      dateTime: "2024-06-04T12:26:18.293Z",
      documentHash:
        "122f088dd995647bad708fae2313d9fcff597c0f93e3a800c5fd281cd5965402",
      cashboxData: {
        cashbox: "4000438533",
        cashboxLocalNumber: "123",
        name: "ТОВ ТЕСТ ПРРО",
        pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
        pointName: "кафе Ромашка",
        tin: 44657555,
        documentNumber: 1,
        offlineDocumentNumber: 1,
        isCashboxModeOffline: true,
        getOfflineSessionData: {
          id: 23649865,
          seed: 135969449201653,
        },
        previousDocumentHash:
          "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        shiftOpenData: {
          dateTime: "2024-06-04T10:26:18.293Z",
        },
      },
    });
  });
});
