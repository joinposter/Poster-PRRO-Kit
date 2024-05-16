import generateFiscalReceipt from "./generateFiscalReceipt.js";
import { cashboxConfig } from "../textReceiptGenerator/templates/mock.js";
import receiptConfig from "../../config/receiptConfig.js";

describe("generateFiscalReceipt", () => {
  it("should has this structure", async () => {
    const expectedReceipt = [
      "            СГ ТОВ ТЕСТ ПРРО            ",
      '              Кафе "Мʼята"              ',
      "  Дніпропетровська область, м. Дніпро,  ",
      "   Амур-Нижньодніпровський район, вул.  ",
      "    Шолом-Алейхема, 4, кв. (Офіс) 31    ",
      "               ІД 12345678              ",
    ].join("\n");
    expect(
      await generateFiscalReceipt({ cashboxConfig, receiptConfig }),
    ).toEqual(expectedReceipt);
  });
});
