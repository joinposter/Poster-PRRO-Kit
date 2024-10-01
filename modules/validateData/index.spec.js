/* eslint-disable no-magic-numbers */
import {
  createValidator,
  isNotZero,
  isMultiplesOf10,
  isNumber,
  isArray,
  isNonEmptyArray,
  isNonEmptyObject,
  equals,
} from "./index.js";

describe("Validation Functions", () => {
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

  it("should validate total by payments and by products correctly", () => {
    const data = {
      payments: [{ sum: 0.1, type: "cash" }],
      products: [
        {
          count: 1,
          discount: 0.08,
          id: 39,
          name: "Шоколад (Супер акція 1 коп.)",
          price: 0.01,
        },
        { count: 1, discount: -69.99, id: 39, name: "Шоколад", price: 70 },
      ],
    };

    const CENTS_IN_UAH = 100;

    const getTotalByPayments = (payments) =>
      payments.reduce(
        (acc, payment) => acc + Math.round(payment.sum * CENTS_IN_UAH),
        0,
      );

    // Обчислюємо очікувану загальну суму для products
    const getTotalByProducts = ({ products }) =>
      products.reduce((acc, product) => {
        return (
          acc +
          (Math.round(product.price * CENTS_IN_UAH) * product.count +
            Math.round(product.discount * CENTS_IN_UAH))
        );
      }, 0);

    const totalByProducts = getTotalByProducts(data);

    const validationRules = {
      "payments[].sum": [
        isNotZero,
        (sum, type) =>
          type === "cash" ? isMultiplesOf10(sum * CENTS_IN_UAH) : true,
      ],
      payments: [
        (payments) => equals(getTotalByPayments(payments), totalByProducts),
      ],
    };

    const result = createValidator(validationRules)(data);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
});
