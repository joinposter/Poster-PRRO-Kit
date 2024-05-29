import generateTextServiceTransactionReceipt from "./index.js";
import {
  getServiceInputBodyMock,
  getServiceOutputBodyMock,
} from "../../mock.js";

describe("generateServiceInputReceipt", () => {
  it("should has this structure for input", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "----------------------------------------",
      "            СЛУЖБОВЕ ВНЕСЕННЯ           ",
      "----------------------------------------",
      "Готівка                       2850,00грн",
      "",
      "----------------------------------------",
      "           16.05.2024 19:28:35          ",
      "                 ОНЛАЙН                 ",
      "               4000244601               ",
      "              СЛУЖБОВИЙ ЧЕК             ",
      "               Poster POS               ",
    ].join("\n");
    expect(
      await generateTextServiceTransactionReceipt(getServiceInputBodyMock),
    ).toEqual(expectedReceipt);
  });

  it("should has this structure for output", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "----------------------------------------",
      "           СЛУЖБОВЕ ВИЛУЧЕННЯ           ",
      "----------------------------------------",
      "Готівка                       -750,00грн",
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
});
