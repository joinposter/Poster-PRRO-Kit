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
          count: 4000,
          unit: "шт",
          price: 20000,
          discount: 3000,
          taxPrograms: "ГД",
          taxesConfig: {
            VATTaxList: defaultVATTaxList,
            exciseTaxList: defaultExciseTaxList,
          },
        },
        {
          id: 55,
          name: "Морозиво",
          count: 2000,
          unit: "шт",
          price: 9013,
          discount: 2000,
          taxPrograms: "БД",
          taxesConfig: {
            VATTaxList: defaultVATTaxList,
            exciseTaxList: defaultExciseTaxList,
          },
        },
        {
          id: 56,
          name: "Кава",
          count: 1000,
          unit: "шт",
          price: 2013,
          discount: 35,
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
        VATAmount: 12222.22222222222,
        excise: "Д",
        exciseAmount: 3666.6666666666665,
        name: "Сирна паличка",
        turnover: 80000,
        sourceSum: 77000,
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
        exciseAmount: 763.1428571428571,
        name: "Морозиво",
        turnover: 18026,
        sourceSum: 16026,
        unit: "шт",
        taxesConfig: {
          VATTaxList: defaultVATTaxList,
          exciseTaxList: defaultExciseTaxList,
        },
      },
      {
        id: 56,
        VAT: "В",
        VATAmount: 129.4018691588785,
        excise: undefined,
        name: "Кава",
        turnover: 2013,
        sourceSum: 1978,
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
        sourceSum: 93026,
        type: 1,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 80000,
        sourceSum: 73333,
        type: 0,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 999,
        turnover: 18026,
        sourceSum: 15263,
        type: 0,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 330,
        turnover: 2013,
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
        type: 1,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 0%",
        percent: 0,
        program: "Г",
        sum: 0,
        turnover: 80000,
        sourceSum: 73333,
        type: 0,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 7%",
        percent: 7,
        program: "Б",
        sum: 999,
        turnover: 18026,
        sourceSum: 15263,
        type: 0,
        isInCentsAndGrams: true,
      },
      {
        name: "ПДВ 20%",
        percent: 20,
        program: "В",
        sum: 330,
        turnover: 2013,
        sourceSum: 1978,
        type: 0,
        isInCentsAndGrams: true,
      },
    ]);
  });
});
