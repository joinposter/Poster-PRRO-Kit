import defaultReceiptConfig from "./config/receipt.js";
import {
  alternativeSstData,
  cashboxData,
  fiscalReceiptDataMock,
  getServiceInputBodyMock,
  getServiceOutputBodyMock,
  xReportDataMock,
  zReportDataMock,
} from "../../mock.js";
import {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
} from "./index.js";

describe("receiptGenerator", () => {
  it("generateFiscalReceipt should has this structure", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "----------------------------------------",
      "Чек №           485                     ",
      "Тип замовлення  У закладі               ",
      "Відкрито        16 липня 2024 19:29:35  ",
      "Надруковано     16 липня 2024 19:30:35  ",
      "Стіл №          6 (Основний зал)        ",
      "К-сть гостей    2                       ",
      "",
      "----------------------------------------",
      "2 x 130,02                              ",
      "2204109600#                             ",
      "12345678                                ",
      "ADCC123123                              ",
      "Вино игристое вкусное         260,04  ДГ",
      "Знижка                         10,04  ДГ",
      "Ціна зі знижкою               250,00  ДГ",
      "                                        ",
      "4 x 260,00                              ",
      "2204888600#                             ",
      "Сир                          1040,00   Д",
      "                                        ",
      "Сирна палочка                   5,00   Д",
      "",
      "----------------------------------------",
      "ПриватБанк                              ",
      "S1260S6Y                                ",
      "Оплата                                  ",
      "ЕПЗ                     4422********6333",
      "ПЛАТІЖНА СИСТЕМА                    VISA",
      "КОД АВТ.                          159345",
      "RRN                         083998389823",
      "",
      "----------------------------------------",
      "Готівка                       284,30 грн",
      "Безготівкова                   99,96 грн",
      "    Картка                              ",
      "----------------------------------------",
      "Сума                          384,26 грн",
      "ПДВ 20% Г 20%                      29,25",
      "Акциз 5% Д 5%                      18,29",
      "----------------------------------------",
      "До сплати                     384,26 грн",
      "Решта                           0,00 грн",
      "----------------------------------------",
      "     На вас чекає приємний сюрприз!     ",
      "----------------------------------------",
      "            Чек № 2462757750            ",
      "           16.05.2024 19:29:35          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "             ФІСКАЛЬНИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateTextFiscalReceipt({
        ...fiscalReceiptDataMock,
        receiptConfig: defaultReceiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });

  it("offline generateFiscalReceipt should has this structure", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "----------------------------------------",
      "Чек №           485                     ",
      "Тип замовлення  У закладі               ",
      "Відкрито        16 липня 2024 19:29:35  ",
      "Надруковано     16 липня 2024 19:30:35  ",
      "Стіл №          6 (Основний зал)        ",
      "К-сть гостей    2                       ",
      "",
      "----------------------------------------",
      "2 x 130,02                              ",
      "2204109600#                             ",
      "12345678                                ",
      "ADCC123123                              ",
      "Вино игристое вкусное         260,04  ДГ",
      "Знижка                         10,04  ДГ",
      "Ціна зі знижкою               250,00  ДГ",
      "                                        ",
      "4 x 260,00                              ",
      "2204888600#                             ",
      "Сир                          1040,00   Д",
      "                                        ",
      "Сирна палочка                   5,00   Д",
      "",
      "----------------------------------------",
      "ПриватБанк                              ",
      "S1260S6Y                                ",
      "Оплата                                  ",
      "ЕПЗ                     4422********6333",
      "ПЛАТІЖНА СИСТЕМА                    VISA",
      "КОД АВТ.                          159345",
      "RRN                         083998389823",
      "",
      "----------------------------------------",
      "Готівка                       284,30 грн",
      "Безготівкова                   99,96 грн",
      "    Картка                              ",
      "----------------------------------------",
      "Сума                          384,26 грн",
      "ПДВ 20% Г 20%                      29,25",
      "Акциз 5% Д 5%                      18,29",
      "----------------------------------------",
      "До сплати                     384,26 грн",
      "Решта                           0,00 грн",
      "----------------------------------------",
      "     На вас чекає приємний сюрприз!     ",
      "----------------------------------------",
      "          Чек № 31619581.2.2634         ",
      "           16.05.2024 19:29:35          ",
      "                 ОФЛАЙН                 ",
      "                  2634                  ",
      "               4000244601               ",
      "             ФІСКАЛЬНИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateTextFiscalReceipt({
        ...fiscalReceiptDataMock,
        fiscalId: "31619581.2.2634",
        cashboxData: {
          ...cashboxData,
          isOffline: true,
        },
        receiptConfig: defaultReceiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });

  it("generateFiscalReceipt with alternative sstData", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "----------------------------------------",
      "2 x 130,02                              ",
      "2204109600#                             ",
      "12345678                                ",
      "ADCC123123                              ",
      "Вино игристое вкусное         260,04  ДГ",
      "Знижка                         10,04  ДГ",
      "Ціна зі знижкою               250,00  ДГ",
      "                                        ",
      "4 x 260,00                              ",
      "2204888600#                             ",
      "Сир                          1040,00   Д",
      "                                        ",
      "Сирна палочка                   5,00   Д",
      "",
      "----------------------------------------",
      "S1K70F0U                                ",
      "Оплата                                  ",
      "ЕПЗ                     XXXXXXXXXXXX1935",
      "ПЛАТІЖНА СИСТЕМА              MasterCard",
      "КОД АВТ.                          400035",
      "RRN                         085875832176",
      "",
      "----------------------------------------",
      "Готівка                       284,30 грн",
      "Безготівкова                   99,96 грн",
      "    Картка                              ",
      "----------------------------------------",
      "Сума                          384,26 грн",
      "ПДВ 20% Г 20%                      29,25",
      "Акциз 5% Д 5%                      18,29",
      "----------------------------------------",
      "До сплати                     384,26 грн",
      "Решта                           0,00 грн",
      "----------------------------------------",
      "            Чек № 2462757750            ",
      "           16.05.2024 19:29:35          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "             ФІСКАЛЬНИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateTextFiscalReceipt({
        ...fiscalReceiptDataMock,
        headerServiceData: null,
        footerServiceData: null,
        sstData: alternativeSstData,
        receiptConfig: defaultReceiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });

  it("generateTextServiceTransactionReceipt should has this structure for input", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "----------------------------------------",
      "            СЛУЖБОВЕ ВНЕСЕННЯ           ",
      "----------------------------------------",
      "Готівка                      2850,00 грн",
      "",
      "----------------------------------------",
      "           16.05.2024 19:28:35          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "              СЛУЖБОВИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateTextServiceTransactionReceipt(getServiceInputBodyMock),
    ).toEqual(expectedReceipt);
  });

  it("generateTextServiceTransactionReceipt should has this structure for output", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "----------------------------------------",
      "           СЛУЖБОВЕ ВИЛУЧЕННЯ           ",
      "----------------------------------------",
      "Готівка                       750,00 грн",
      "",
      "----------------------------------------",
      "           16.05.2024 19:28:35          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "              СЛУЖБОВИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      await generateTextServiceTransactionReceipt(getServiceOutputBodyMock),
    ).toEqual(expectedReceipt);
  });

  it("generateXReport should has this structure", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "                 X-звіт                 ",
      "----------------------------------------",
      "Зміна відкрита       24.05.2024 16:20:05",
      "Останній фіскальний  27.05.2024 20:22:06",
      "чек                                     ",
      "Фіскальний номер              2469255615",
      "останього чеку                          ",
      "Валюта звіту                         грн",
      "",
      "                 Продаж                 ",
      "----------------------------------------",
      "Загальний обіг                   2681,80",
      "ГОТІВКА                          2020,80",
      "КАРТКА                            661,00",
      "Кількість чеків                       31",
      "",
      "ПДВ В 7%                                ",
      "Сума податку                       23,31",
      "Обіг без податку                  352,73",
      "Обіг за податком                  376,04",
      "",
      "ПДВ Г 20%                               ",
      "Сума податку                      175,50",
      "Обіг без податку                  930,06",
      "Обіг за податком                 1105,56",
      "",
      "Акцизний податок Д 5%                   ",
      "Сума податку                      127,54",
      "Обіг без податку                 2554,06",
      "Обіг за податком                 2681,60",
      "",
      "               Повернення               ",
      "----------------------------------------",
      "Загальний обіг                     31,00",
      "ГОТІВКА                            30,00",
      "КАРТКА                              1,00",
      "Кількість чеків                        2",
      "",
      "ПДВ В 7%                                ",
      "Сума податку                        1,92",
      "Обіг без податку                   29,12",
      "Обіг за податком                   31,04",
      "",
      "Акцизний податок Д 5%                   ",
      "Сума податку                        1,47",
      "Обіг без податку                   29,57",
      "Обіг за податком                   31,04",
      "",
      "         Готівкові кошти в касі         ",
      "----------------------------------------",
      "Початковий залишок                  0,00",
      "Службове внесення                   0,00",
      "Службове вилучення                  0,00",
      "Кінцевий залишок                 1990,80",
      "",
      "----------------------------------------",
      "           27.05.2024 20:22:06          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "           СЛУЖБОВИЙ ДОКУМЕНТ           ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateXZReport({
        ...xReportDataMock,
        receiptConfig: defaultReceiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });

  it("generateZReport should have this structure", () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '             "Кафе "Мʼята""             ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "           Касир Шевченко Т.Г.          ",
      "                Z-звіт №1               ",
      "----------------------------------------",
      "Зміна відкрита       24.05.2024 16:20:05",
      "Останній фіскальний  27.05.2024 20:22:06",
      "чек                                     ",
      "Фіскальний номер              2469255615",
      "останього чеку                          ",
      "Валюта звіту                         грн",
      "",
      "                 Продаж                 ",
      "----------------------------------------",
      "Загальний обіг                   2681,80",
      "ГОТІВКА                          2020,80",
      "КАРТКА                            661,00",
      "Кількість чеків                       31",
      "",
      "ПДВ В 7%                                ",
      "Сума податку                       23,31",
      "Обіг без податку                  352,73",
      "Обіг за податком                  376,04",
      "",
      "ПДВ Г 20%                               ",
      "Сума податку                      175,50",
      "Обіг без податку                  930,06",
      "Обіг за податком                 1105,56",
      "",
      "Акцизний податок Д 5%                   ",
      "Сума податку                      127,54",
      "Обіг без податку                 2554,06",
      "Обіг за податком                 2681,60",
      "",
      "               Повернення               ",
      "----------------------------------------",
      "Загальний обіг                     31,00",
      "ГОТІВКА                            30,00",
      "КАРТКА                              1,00",
      "Кількість чеків                        2",
      "",
      "ПДВ В 7%                                ",
      "Сума податку                        1,92",
      "Обіг без податку                   29,12",
      "Обіг за податком                   31,04",
      "",
      "Акцизний податок Д 5%                   ",
      "Сума податку                        1,47",
      "Обіг без податку                   29,57",
      "Обіг за податком                   31,04",
      "",
      "         Готівкові кошти в касі         ",
      "----------------------------------------",
      "Початковий залишок                  0,00",
      "Службове внесення                 100,00",
      "Службове вилучення                200,00",
      "Кінцевий залишок                 1890,80",
      "",
      "----------------------------------------",
      "           27.05.2024 20:22:06          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "           ФІСКАЛЬНИЙ ДОКУМЕНТ          ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      generateXZReport({
        ...zReportDataMock,
        receiptConfig: defaultReceiptConfig,
      }),
    ).toEqual(expectedReceipt);
  });
});
