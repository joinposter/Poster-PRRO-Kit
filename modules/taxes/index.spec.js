import { calcTaxesForProducts, getTaxesData } from "./index.js";
import { defaultExciseTaxList, defaultVATTaxList } from "./config/taxes.js";
import { mockCustomTaxes } from "./mock/taxes.js";

describe("taxes", () => {
  it("calcTaxesForProducts should return list of products with taxes and updated turnover", () => {
    expect(
      calcTaxesForProducts([
        {
          id: 54,
          name: "Сирна паличка",
          count: 4,
          unit: "шт",
          price: 200,
          discount: 30,
          taxPrograms: "ГД",
          taxesConfig: {
            VATTaxList: defaultVATTaxList,
            exciseTaxList: defaultExciseTaxList,
          },
        },
        {
          id: 55,
          name: "Морозиво",
          count: 2,
          unit: "шт",
          price: 90.13,
          discount: 20,
          taxPrograms: "БД",
          taxesConfig: {
            VATTaxList: defaultVATTaxList,
            exciseTaxList: defaultExciseTaxList,
          },
        },
        {
          id: 56,
          name: "Кава",
          count: 1,
          unit: "шт",
          price: 20.13,
          discount: 0.35,
          taxPrograms: "В",
          taxesConfig: {
            VATTaxList: defaultVATTaxList,
            exciseTaxList: defaultExciseTaxList,
          },
        },
      ]),
    ).toEqual([
      {
        id: 54,
        VAT: "Г",
        VATAmount: 122.22222222222223,
        excise: "Д",
        exciseAmount: 36.666666666666664,
        name: "Сирна паличка",
        turnover: 800,
        sourceSum: 770,
        unit: "шт",
        taxesConfig: {
          VATTaxList: defaultVATTaxList,
          exciseTaxList: defaultExciseTaxList,
        },
      },
      {
        id: 55,
        VAT: "Б",
        VATAmount: 0,
        excise: "Д",
        exciseAmount: 7.631428571428571,
        name: "Морозиво",
        turnover: 180.26,
        sourceSum: 160.26,
        unit: "шт",
        taxesConfig: {
          VATTaxList: defaultVATTaxList,
          exciseTaxList: defaultExciseTaxList,
        },
      },
      {
        id: 56,
        VAT: "В",
        VATAmount: 1.2940186915887848,
        excise: undefined,
        name: "Кава",
        turnover: 20.13,
        sourceSum: 19.779999999999998,
        unit: "шт",
        taxesConfig: {
          VATTaxList: defaultVATTaxList,
          exciseTaxList: defaultExciseTaxList,
        },
      },
    ]);
  });

  it("getTaxesData should return list of uniq taxes with common amount", () => {
    expect(
      getTaxesData(mockCustomTaxes)([
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
      ]),
    ).toEqual([
      {
        name: "Акциз",
        percent: 5,
        program: "Д",
        sum: 44.3,
        turnover: 980.26,
        sourceSum: 930.26,
        type: 5,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 800,
        sourceSum: 733.33,
        type: 4,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 9.99,
        turnover: 180.26,
        sourceSum: 152.63,
        type: 2,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 3.3,
        turnover: 20.13,
        sourceSum: 19.78,
        type: 3,
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
      ]),
    ).toEqual([
      {
        name: "Акциз",
        percent: 5,
        program: "Д",
        sum: 4430,
        turnover: 98026,
        sourceSum: 93026,
        type: 5,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 80000,
        sourceSum: 73333,
        type: 4,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 999,
        turnover: 18026,
        sourceSum: 15263,
        type: 2,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 330,
        turnover: 2013,
        sourceSum: 1978,
        type: 3,
        isInCentsAndGrams: true,
      },
    ]);
  });
});
