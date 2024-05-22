import generateTextServiceInputReceipt from "./index.js";
import { getServiceInputBodyMock } from "../../mock.js";

describe("generateServiceInputReceipt", () => {
  it("should has this structure", async () => {
    const expectedReceipt = [
      "              ТОВ ТЕСТ ПРРО             ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
      "----------------------------------------",
      "            Службове внесення           ",
      "----------------------------------------",
      "Готівка                       2850,00грн",
      "",
      "----------------------------------------",
      "16.05.2024                      19:28:35",
      "ФН ПРРО                       4000244601",
      "",
      "----------------------------------------",
      "              СЛУЖБОВИЙ ЧЕК             ",
      "                 POSTER                 ",
      "----------------------------------------",
    ].join("\n");
    expect(
      await generateTextServiceInputReceipt(getServiceInputBodyMock),
    ).toEqual(expectedReceipt);
  });
});
