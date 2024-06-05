import { cashboxData } from "./mock/data.js";
import { mockCustomTaxes } from "../taxes/mock/taxes.js";
import {
  generateOfflineReceiptDocument,
  generateOfflineTransactionDocument,
  generateOfflineOpenShiftDocument,
  generateOfflineCloseShiftDocument,
} from "./index.js";

describe("offline mode", () => {
  it("fiscalReceiptOffline should return all data for generation receipt", () => {
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
  it("sendTransactionOffline should return all data for generation receipt", () => {
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
      },
      sum: 1000,
    });
  });
  it("openShiftOffline should return all data for generation receipt", () => {
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
      },
    });
  });
  it("closeShiftOffline should return all data for generation receipt", () => {
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
      },
    });
  });
});
