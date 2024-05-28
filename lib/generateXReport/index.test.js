import generateXReport from "./index.js";
import receiptConfig from "../../config/receiptConfig.js";
import { xReportDataMock } from "../../mock.js";

describe("generateFiscalReceipt", () => {
  it("should has this structure", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "                 X-звіт                 ",
      "----------------------------------------",
      "Зміна відкрита       24.05.2024 16:20:05",
      "Останній фіскальний  27.05.2024 20:22:06",
      "чек                                     ",
      "Фіскальний номер                     516",
      "чеку                                    ",
      "Валюта звіту                         грн",
      "",
      "                 Продаж                 ",
      "----------------------------------------",
      "Загальний обіг                   2681,80",
      "ГОТІВКА                          2020,80",
      "КАРТКА                            661,00",
      "Кількість чеків                       31",
      "",
      "Акцизний податок (Д) 5%                 ",
      "Сума податку                      127,54",
      "Обіг без податку                 2554,06",
      "Обіг за податком                 2681,60",
      "",
      "ПДВ (В) 7%                              ",
      "Сума податку                       23,31",
      "Обіг без податку                  352,73",
      "Обіг за податком                  376,04",
      "",
      "ПДВ (Г) 20%                             ",
      "Сума податку                      175,50",
      "Обіг без податку                  930,06",
      "Обіг за податком                 1105,56",
      "",
      "               Повернення               ",
      "----------------------------------------",
      "Загальний обіг                     31,00",
      "ГОТІВКА                            30,00",
      "КАРТКА                              1,00",
      "Кількість чеків                        2",
      "",
      "Акцизний податок (Д) 5%                 ",
      "Сума податку                        1,47",
      "Обіг без податку                   29,57",
      "Обіг за податком                   31,04",
      "",
      "ПДВ (В) 7%                              ",
      "Сума податку                        1,92",
      "Обіг без податку                   29,12",
      "Обіг за податком                   31,04",
      "",
      "         Готівкові кошти в касі         ",
      "----------------------------------------",
      "Початковий залишок                  0,00",
      "Службове внесення                   0,00",
      "Службове вилучення                  0,00",
      "Кінцевий залишок                    0,00",
      "",
      "----------------------------------------",
      "           27.05.2024 20:22:06          ",
      "               4000244601               ",
      "                 ОНЛАЙН                 ",
      "           СЛУЖБОВИЙ ДОКУМЕНТ           ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      await generateXReport({
        ...xReportDataMock,
        receiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });
});