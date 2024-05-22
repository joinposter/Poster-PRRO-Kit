import generateFiscalReceipt from "./index.js";
import receiptConfig from "../../config/receiptConfig.js";
import {
  cashboxData,
  productsInfo,
  taxesInfo,
  roundInfo,
  bankInfo,
  footerInfo,
} from "../../mock.js";

describe.skip("generateFiscalReceipt", () => {
  it("should has this structure", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "----------------------------------------",
      "2204109600#                             ",
      "12345678                                ",
      "ADCC123123                              ",
      "Вино игристое 2 x 130,02   260,04   ДГ",
      "вкусное                               ",
      "",
      "2204888600#                             ",
      "Сир           4 x 260,00  1040,00    Д",
      "",
      "Готівкою                       200,00грн",
      "Карткою                       1100,00грн",
      "----------------------------------------",
      "Сума                          1300,04грн",
      "ПДВ Г 20%                         214,60",
      "Акцизний податок Д 5%              12,38",
      "----------------------------------------",
      "До сплати                     1300,00грн",
      "Заокруглення                     0,04грн",
      "",
      "----------------------------------------",
      "ПриватБанк                              ",
      "S1260S6Y                                ",
      "Оплата                                  ",
      "ЕПЗ                     1234********5678",
      "ПЛАТІЖНА СИСТЕМА              MASTERCARD",
      "КОД АВТ.                          199016",
      "RRN                         082699265208",
      "КАСИР                         ..........",
      "ДЕРЖАТЕЛЬ ЕПЗ                 ..........",
      "",
      "----------------------------------------",
      "                13eG45ty                ",
      "           16.05.2024 19:29:35          ",
      "               4000244601               ",
      "                 ОНЛАЙН                 ",
      "             ФІСКАЛЬНИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      await generateFiscalReceipt({
        cashboxData,
        receiptConfig,
        productsInfo,
        taxesInfo,
        roundInfo,
        bankInfo,
        footerInfo,
      }),
    ).toEqual(expectedReceipt);
  });
});