/* eslint-disable no-magic-numbers */
import receipt from "receipt";
import { priceFormat, initReceipt } from "../../../helpers/receipt.js";
import { getServiceInputBodyMock } from "../../../mock.js";

describe("receipt libs", () => {
  beforeAll(() => {
    initReceipt(getServiceInputBodyMock.receiptConfig);
  });
  describe("default format", () => {
    it("generate lines for ruler, text and empty formats", async () => {
      const data = [
        {
          type: "ruler",
        },
        {
          type: "text",
          value: "Test value left",
          align: "left",
        },
        {
          type: "empty",
        },
        {
          type: "text",
          value: ["Test value center line1", "Test value center line2"],
          align: "center",
        },
        {
          type: "empty",
        },
        {
          type: "text",
          value: "Test value right",
          align: "right",
        },
        {
          type: "ruler",
        },
      ];
      const expectedReceipt = [
        "----------------------------------------",
        "Test value left                         ",
        "                                        ",
        "         Test value center line1        ",
        "         Test value center line2        ",
        "                                        ",
        "                        Test value right",
        "----------------------------------------",
      ].join("\n");
      expect(await receipt.create(data)).toEqual(expectedReceipt);
    });
    it("generate lines for properties format", async () => {
      const data = [
        {
          type: "ruler",
        },
        {
          type: "properties",
          lines: [
            { name: "Order Number", value: "XXXXXXXXXXXX" },
            { name: "Date", value: "XX/XX/XXXX XX:XX" },
          ],
        },
        {
          type: "ruler",
        },
      ];
      const expectedReceipt = [
        "----------------------------------------",
        "Order Number:    XXXXXXXXXXXX",
        "Date:            XX/XX/XXXX XX:XX",
        "----------------------------------------",
      ].join("\n");
      expect(await receipt.create(data)).toEqual(expectedReceipt);
    });
    it("generate lines for table format", async () => {
      const data = [
        {
          type: "table",
          lines: [
            { item: "Product 1", qty: 1, cost: 1000 },
            {
              item: "Product 2 with a really long name",
              qty: 1,
              cost: 17500,
              discount: { type: "absolute", value: 1000 },
            },
            { item: "Another product wth quite a name", qty: 2, cost: 900 },
            {
              item: "Product 4",
              qty: 1,
              cost: 80,
              discount: { type: "percentage", value: 0.15 },
            },
            {
              item: "This length is ridiculously lengthy",
              qty: 14,
              cost: 8516,
            },
            { item: "Product 6", qty: 3, cost: 500 },
            {
              item: "Product 7",
              qty: 3,
              cost: 500,
              discount: {
                type: "absolute",
                value: 500,
                message: "3 for the price of 2",
              },
            },
          ],
        },
      ];
      const expectedReceipt = [
        "----------------------------------------",
        "Qty   Product                      Total",
        "----------------------------------------",
        "1     Product 1                 грн10.00",
        "1     Product 2 with a reall   грн165.00",
        "        (Item Disc. -грн10.00)",
        "2     Another product wth qu    грн18.00",
        "1     Product 4                  грн0.68",
        "        (Item Disc. -15%)",
        "14    This length is ridicul  грн1192.24",
        "3     Product 6                 грн15.00",
        "3     Product 7                 грн10.00",
        "        (3 for the price of 2)",
        "----------------------------------------",
      ].join("\n");
      expect(await receipt.create(data)).toEqual(expectedReceipt);
    });
  });
  describe("custom format", () => {
    describe("smartTable", () => {
      it("generate wideTable (width more than 40) with 4 columns", async () => {
        const data = [
          {
            type: "smartTable",
            headers: [
              { name: "Назва", relation: 10 },
              { name: "Кількість", relation: 10 },
              { name: "Ціна", relation: 10 },
              { name: "Сума", relation: 10 },
            ],
            items: [
              { row: ["Сирна паличка", "1 шт.", "200.00грн.", "200.00грн."] },
              { row: ["Морозиво", "2 шт.", "92.13грн.", "184.26грн."] },
            ],
          },
        ];
        const expectedReceipt = [
          "----------------------------------------",
          "Назва     Кількість Ціна            Сума",
          "                                        ",
          "Сирна     1 шт.     200.00грн.200.00грн.",
          "паличка                                 ",
          "Морозиво  2 шт.     92.13грн. 184.26грн.",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
      });
      it("generate wideTable (width more than 40) with 2 column", async () => {
        const data = [
          {
            type: "smartTable",
            headers: [
              { name: "Назва", relation: 10 },
              { name: "Кількість", relation: 10 },
            ],
            items: [
              { row: ["Сирна паличка", "1 шт."] },
              { row: ["Морозиво", "2 шт."] },
            ],
          },
        ];
        const expectedReceipt = [
          "----------------------------------------",
          "Назва                          Кількість",
          "                                        ",
          "Сирна паличка                      1 шт.",
          "Морозиво                           2 шт.",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
      });
      it("generate wideTable (width more than 40) without header", async () => {
        const data = [
          {
            type: "smartTable",
            items: [
              { row: ["Сирна паличка", "1 шт."] },
              { row: ["Морозиво", "2 шт."] },
            ],
          },
        ];
        const expectedReceipt = [
          "----------------------------------------",
          "Сирна паличка                      1 шт.",
          "Морозиво                           2 шт.",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
      });
      it("generate narrowTable (width less than 40) with 4 columns", async () => {
        receipt.config.width = 30;
        const data = [
          {
            type: "smartTable",
            headers: [
              { name: "Назва", relation: 10 },
              { name: "Кількість", relation: 10 },
              { name: "Ціна", relation: 10 },
              { name: "Сума", relation: 10 },
            ],
            items: [
              { row: ["Сирна паличка", "1 шт.", "200.00грн.", "200.00грн."] },
              { row: ["Морозиво", "2 шт.", "92.13грн.", "184.26грн."] },
            ],
          },
        ];
        const expectedReceipt = [
          "------------------------------",
          "Сирна паличка                 ",
          "   1 шт. 200.00грн. 200.00грн.",
          "Морозиво                      ",
          "    2 шт. 92.13грн. 184.26грн.",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
        receipt.config.width = 50;
      });
      it("generate narrowTable (width less than 40) with 2 column", async () => {
        receipt.config.width = 30;
        const data = [
          {
            type: "smartTable",
            items: [
              { row: ["Сирна паличка", "10шт."] },
              { row: ["Морозиво", "5шт."] },
              { row: ["Хліб", "1шт."] },
            ],
          },
        ];
        const expectedReceipt = [
          "------------------------------",
          "Сирна паличка            10шт.",
          "Морозиво                  5шт.",
          "Хліб                      1шт.",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
        receipt.config.width = 50;
      });
    });
    describe("summary", () => {
      it("generate summary format", async () => {
        const data = [
          {
            type: "summary",
            lines: [
              { name: "Загальний обіг", value: priceFormat(12.2) },
              { name: "Готівка", value: priceFormat(5.1) },
              { name: "Картка", value: priceFormat(7.1) },
              { name: "Кількість чеків", value: 20 },
            ],
            delimeter: ".",
            hideTopBorder: false,
            hideBottomBorder: false,
          },
        ];
        const expectedReceipt = [
          "--------------------------------------------------",
          "Загальний обіг ............................. 12,20",
          "Готівка ..................................... 5,10",
          "Картка ...................................... 7,10",
          "Кількість чеків  20",
          "--------------------------------------------------",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
      });
    });
    describe("smartProperties", () => {
      it("generate smartProperties format", async () => {
        const data = [
          {
            type: "smartProperties",
            lines: [
              { name: "Официан", value: "Сергей" },
              { name: "Цех", value: "Кухня" },
              { name: "Стіл №", value: "1 (Основний зал)" },
              { name: "Тип замовлення", value: "У закладі" },
              { name: "Комментарии", value: "", hide: true },
            ],
          },
        ];
        const expectedReceipt = [
          "Официан             Сергей                        ",
          "Цех                 Кухня                         ",
          "Стіл №              1 (Основний зал)              ",
          "Тип замовлення      У закладі                     ",
          "",
        ].join("\n");
        expect(await receipt.create(data)).toEqual(expectedReceipt);
      });
    });
  });
});
