import generateServiceOutputReceipt from "./generateServiceOutputReceipt.js";
import { getServiceOutputBodyMock } from "../../mock.js";

describe("generateServiceOutputReceipt", () => {
  it("should has this structure", async () => {
    const expectedReceipt = [
      "            СГ ТОВ ТЕСТ ПРРО            ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "----------------------------------------",
      "           Службове вилучення           ",
      "----------------------------------------",
      "Готівка                       -750,00грн",
      "",
      "----------------------------------------",
      "16.05.2024                      19:48:35",
      "ФН ПРРО                       4000244601",
      "",
      "----------------------------------------",
      "              СЛУЖБОВИЙ ЧЕК             ",
      "                 POSTER                 ",
      "----------------------------------------",
    ].join("\n");
    expect(
      await generateServiceOutputReceipt(getServiceOutputBodyMock),
    ).toEqual(expectedReceipt);
  });
});
