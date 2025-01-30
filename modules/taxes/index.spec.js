import { getTaxesData } from "./index.js";
import { mockCustomTaxes } from "./mock/taxes.js";

describe("taxes", () => {
  it("getTaxesData should return list of uniq taxes with common amount", () => {
    expect(
      getTaxesData(mockCustomTaxes)([
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
      ]),
    ).toEqual([
      {
        name: "Акциз",
        percent: 5,
        program: "Д",
        sum: 4430,
        turnover: 98026,
        turnoverDiscount: 93026,
        sourceSum: 93026,
        type: 1,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 80000,
        turnoverDiscount: 77000,
        sourceSum: 73333,
        type: 0,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 999,
        turnover: 18026,
        turnoverDiscount: 16026,
        sourceSum: 15263,
        type: 0,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 330,
        turnover: 2013,
        turnoverDiscount: 1978,
        sourceSum: 1978,
        type: 0,
      },
    ]);
  });

  it("getTaxesData should return list of uniq taxes with common amount in cents and grams format", () => {
    expect(
      getTaxesData(mockCustomTaxes)([
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
      ]),
    ).toEqual([
      {
        name: "Акциз",
        percent: 5,
        program: "Д",
        sum: 4430,
        turnover: 98026,
        turnoverDiscount: 93026,
        sourceSum: 93026,
        type: 1,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 80000,
        turnoverDiscount: 77000,
        sourceSum: 73333,
        type: 0,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 999,
        turnover: 18026,
        turnoverDiscount: 16026,
        sourceSum: 15263,
        type: 0,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 330,
        turnover: 2013,
        turnoverDiscount: 1978,
        sourceSum: 1978,
        type: 0,
      },
    ]);
  });
});
