import generateReceipt from "./generateReceipt.js";
import receiptData from "./textReceiptGenerator/templates/receipt.js";

describe("receipt", () => {
  it("generateReceipt", async () => {
    expect(await generateReceipt(receiptData)).toEqual(
      "ReceiptData                             ",
    );
  });
});
