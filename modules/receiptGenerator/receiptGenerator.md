## Сервіс Генерація чеків
Для того, щоб згенерувати чек, необхідно викликати один з методів:
- `generateFiscalReceipt`
- `generateHtmlFiscalReceipt`
- `generateTextFiscalReceipt`
- `generateTextServiceTransactionReceipt`
- `generateXZReport`

Які виглядають чеки та які дані очикують ці методи можна побачити в
[unit тестах](index.spec.js) для цього сервіса.

## Формати для генерації чеків
[Детальніше](modules/receiptGenerator/textReceiptGenerator/formatters/formatters.md)



