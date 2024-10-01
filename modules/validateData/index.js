export const createValidator =
  (validationRules) =>
  (data, path = "") => {
    const errors = Object.entries(data).reduce((acc, [key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      let rulePath = currentPath;

      // Якщо такого правила по шляху не існує і шлях містить індекси масиву (наприклад, foo.bar[2]),
      // замінюємо на foo.bar[] для використання загального правила
      if (!validationRules[rulePath] && /\[\d+\]/.test(currentPath)) {
        rulePath = currentPath.replace(/\[\d+\]/g, "[]");
      }

      const rules = validationRules[rulePath];

      if (rules) {
        rules.forEach((rule) => {
          const isValid = rule(value);
          if (!isValid) {
            acc[currentPath] = acc[currentPath] || [];
            acc[currentPath].push(`Invalid value for ${currentPath}`);
          }
        });
      }

      // Якщо значення є масивом, перевіряємо кожен елемент масиву
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayPath = `${currentPath}[${index}]`;
          const nestedErrors = createValidator(validationRules)(
            item,
            arrayPath,
          );
          Object.assign(acc, nestedErrors.errors);
        });
      }

      // Якщо значення є об'єктом, перевіряємо вкладену структуру
      else if (typeof value === "object" && value !== null) {
        const nestedErrors = createValidator(validationRules)(
          value,
          currentPath,
        );
        Object.assign(acc, nestedErrors.errors);
      }

      return acc;
    }, {});

    return Object.keys(errors).length
      ? { valid: false, errors }
      : { valid: true, errors: null };
  };

export const isNumber = (value) =>
  typeof value === "number" && !Number.isNaN(value);
export const isNotZero = (value) => value !== 0;
// eslint-disable-next-line no-magic-numbers
export const isMultiplesOf10 = (value) => value % 10 === 0;
export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) =>
  Array.isArray(value) && value.length > 0;
export const isNonEmptyObject = (value) =>
  typeof value === "object" && value !== null && Object.keys(value).length > 0;

export const equals = (value1, value2) => value1 === value2;
