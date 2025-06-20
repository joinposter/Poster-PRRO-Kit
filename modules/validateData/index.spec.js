/* eslint-disable no-magic-numbers */
import {
  createValidator,
  isNotZero,
  isMultiplesOf10,
  isNumber,
  isArray,
  isNonEmptyArray,
  isNonEmptyObject,
  isPaymentByCashMultipleOf10,
  isReceiptTotalValid,
  optionalObject,
  isString,
  optionalMatch,
  isOptionalString,
} from "./index.js";

describe("validation", () => {
  describe("validation functions", () => {
    describe("notZero", () => {
      it("should return true for non-zero values", () => {
        expect(isNotZero(5)).toBe(true);
        expect(isNotZero(-5)).toBe(true);
      });

      it("should return false for zero", () => {
        expect(isNotZero(0)).toBe(false);
      });
    });

    describe("isMultiplesOf10", () => {
      it("should return true for multiples of 10", () => {
        expect(isMultiplesOf10(10)).toBe(true);
        expect(isMultiplesOf10(100)).toBe(true);
        expect(isMultiplesOf10(0)).toBe(true);
      });

      it("should return false for non-multiples of 10", () => {
        expect(isMultiplesOf10(15)).toBe(false);
        expect(isMultiplesOf10(7)).toBe(false);
      });
    });
  });

  describe("createValidator", () => {
    it("should return valid when all fields pass validation in deep object", () => {
      const data = { foo: { baz1: 20, baz2: 5 } };
      const validationRules = {
        "foo.baz1": [isMultiplesOf10],
        "foo.baz2": [isNumber, isNotZero],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual(null);
    });

    it("should return valid when all fields pass validation in deep array", () => {
      const data = {
        foo: {
          bar: [{ baz: 20 }, { baz: 30 }, { baz: 10 }, { baz3: 15 }],
        },
      };
      const validationRules = {
        foo: [isNonEmptyObject], // Перевірка, чи об'єкт foo не порожній
        "foo.bar": [isArray, isNonEmptyArray], // Перевірка, що це масив і він не порожній
        "foo.bar[].baz": [isNumber, isNotZero, isMultiplesOf10], // Правило для кожного елемента масиву
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual(null);
    });

    it("should return errors when validation fails", () => {
      const data = { amount: 25, value: 0 };
      const validationRules = {
        amount: [isMultiplesOf10],
        value: [isNotZero],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        amount: ["Invalid value for amount"],
        value: ["Invalid value for value"],
      });
    });

    it("should skip validation if there is no rule for a field", () => {
      const data = { amount: 25, description: "test" };
      const validationRules = {
        amount: [isMultiplesOf10],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        amount: ["Invalid value for amount"],
      });
      expect(result.errors.description).toBeUndefined(); // no validation for 'description'
    });

    it("should return valid if no validation rules provided", () => {
      const data = { amount: 25, description: "test" };
      const validationRules = {};

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual(null);
    });
  });

  describe("payments and products validator", () => {
    it("should validate total by payments and products correctly", () => {
      const data = {
        payments: [{ sum: 10, type: "cash" }],
        products: [
          {
            count: 1000,
            discount: -8,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 1,
          },
          { count: 1000, discount: 6999, id: 39, name: "Шоколад", price: 7000 },
        ],
      };

      const validationRules = {
        "": [isReceiptTotalValid],
        payments: [isPaymentByCashMultipleOf10],
        "payments[].sum": [isNotZero],
      };

      const result = createValidator(validationRules)(data);

      // expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it("should return valid when was card payment and all rulles done", () => {
      const data = {
        payments: [{ sum: 25, type: "card" }], // Не кратний 10
        products: [
          {
            count: 1000,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 21,
          },
          { count: 1000, discount: 6996, id: 39, name: "Шоколад", price: 7000 },
        ],
      };

      const validationRules = {
        "": [isReceiptTotalValid],
        payments: [isPaymentByCashMultipleOf10],
        "payments[].sum": [isNotZero],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it("should return error when cash payment is not multiple of 10", () => {
      const data = {
        payments: [{ sum: 25, type: "cash" }], // Не кратний 10
        products: [
          {
            count: 1000,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 21,
          },
          { count: 1000, discount: 6996, id: 39, name: "Шоколад", price: 7000 },
        ],
      };

      const validationRules = {
        "": [isReceiptTotalValid],
        payments: [isPaymentByCashMultipleOf10],
        "payments[].sum": [isNotZero],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        payments: ["Invalid value for payments"],
      });
    });

    it("should return error when total of products does not match total payments", () => {
      const data = {
        payments: [{ sum: 5000, type: "cash" }], // Загальна сума не збігається
        products: [
          {
            count: 1000,
            discount: -8,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 1,
          },
          { count: 1000, discount: 6999, id: 39, name: "Шоколад", price: 7000 },
        ],
      };

      const validationRules = {
        "": [isReceiptTotalValid],
        payments: [isPaymentByCashMultipleOf10],
        "payments[].sum": [isNotZero],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        "": ["Invalid value for input data"],
      });
    });

    it("should return error when was cash payment is 0", () => {
      const data = {
        payments: [
          { sum: 36, type: "card" },
          { sum: 0, type: "cash" },
        ],
        products: [
          {
            count: 1000,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 32,
          },
          { count: 1000, discount: 6996, id: 39, name: "Шоколад", price: 7000 },
        ],
      };

      const validationRules = {
        "": [isReceiptTotalValid],
        payments: [isPaymentByCashMultipleOf10],
        "payments[].sum": [isNotZero],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        "payments[1].sum": ["Invalid value for payments[1].sum"],
      });
    });
  });

  describe("sstData validator", () => {
    it("should return valid if sstData is undefined", () => {
      const data = {
        payments: [
          { sum: 36, type: "card" },
          { sum: 0, type: "cash" },
        ], // Сума дорівнює 0
        products: [
          {
            count: 1000,
            id: 39,
            name: "Шоколад (Супер акція 1 коп.)",
            price: 32,
          },
          { count: 1000, discount: 6996, id: 39, name: "Шоколад", price: 7000 },
        ],
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            authCode: [isString],
            sum: [optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(true);
    });

    it("should return valid if sstData is valid", () => {
      const data = {
        sstData: {
          bankAcquirer: "ПриватБанк",
          sum: "1.68",
          authCode: "159345",
          paymentSystem: "VISA",
          paymentSystemName: "VISA",
          merchant: "S1260S6Y",
          merchantId: "ПриватБанк",
          rrn: "083998389823",
          rrnExt: "414815005125",
          terminalId: "S1260S6Y",
          cardNumber: "4422********6333",
        },
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            authCode: [isString],
            sum: [optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(true);
    });

    it("should return valid if sstData sum is undefined", () => {
      const data = {
        sstData: {
          bankAcquirer: "ПриватБанк",
          authCode: "159345",
          paymentSystem: "VISA",
          paymentSystemName: "VISA",
          merchant: "S1260S6Y",
          merchantId: "ПриватБанк",
          rrn: "083998389823",
          rrnExt: "414815005125",
          terminalId: "S1260S6Y",
          cardNumber: "4422********6333",
        },
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            authCode: [isString],
            sum: [optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);

      expect(result.valid).toBe(true);
    });

    it("should return invalid if sstData sum is number", () => {
      const data = {
        sstData: {
          bankAcquirer: "ПриватБанк",
          sum: 1.68,
          authCode: "159345",
          paymentSystem: "VISA",
          paymentSystemName: "VISA",
          merchant: "S1260S6Y",
          merchantId: "ПриватБанк",
          rrn: "083998389823",
          rrnExt: "414815005125",
          terminalId: "S1260S6Y",
          cardNumber: "4422********6333",
        },
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            authCode: [isString],
            sum: [isOptionalString, optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        "sstData.sum": ["Invalid value for sum"],
      });
    });

    it("should return invalid if sstData sum has incorrect format", () => {
      const data = {
        sstData: {
          bankAcquirer: "ПриватБанк",
          sum: "168",
          authCode: "159345",
          paymentSystem: "VISA",
          paymentSystemName: "VISA",
          merchant: "S1260S6Y",
          merchantId: "ПриватБанк",
          rrn: "083998389823",
          rrnExt: "414815005125",
          terminalId: "S1260S6Y",
          cardNumber: "4422********6333",
        },
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            authCode: [isString],
            sum: [isOptionalString, optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        "sstData.sum": ["Invalid value for sum"],
      });
    });

    it("should return invalid if sstData exists but required fields are undefined", () => {
      const data = {
        sstData: {},
      };
      const validSumField = /^\d+(\.\d{2})$/;
      const validationRules = {
        sstData: [
          optionalObject({
            authCode: [isString],
            paymentSystem: [isString],
            rrn: [isString],
            merchant: [isString],
            terminalId: [isString],
            cardNumber: [isString],
            sum: [isOptionalString, optionalMatch(validSumField)],
          }),
        ],
      };

      const result = createValidator(validationRules)(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        "sstData.authCode": ["Invalid value for authCode"],
        "sstData.paymentSystem": ["Invalid value for paymentSystem"],
        "sstData.rrn": ["Invalid value for rrn"],
        "sstData.merchant": ["Invalid value for merchant"],
        "sstData.terminalId": ["Invalid value for terminalId"],
        "sstData.cardNumber": ["Invalid value for cardNumber"],
      });
    });
  });
});
