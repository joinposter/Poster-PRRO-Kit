# Poster-PRRO-Kit
Цей Kit призначений для роботи з PRRO, а саме для генерації фіскальних чеків 
для термопринтерів, генерації документів для PRRO в офлайн режимі та інших 
подібних операцій. На цей час реалізована лише генерація чеків для 
термопринтерів.

## Генерація чеків
Для того, щоб згенерувати текст чека, необхідно завантажити цей пакет і 
викликати один з методів `generateFiscalReceipt`, `generateHtmlFiscalReceipt`,
`generateTextFiscalReceipt`, `generateTextServiceTransactionReceipt`,
`generateXZReport`, `generateQRCodeReceiptData` 
з даними, які отримали від PRRO, приклад можно 
знайти в [тут](mock.js).

## Формати для генерації чеків
[Детальніше](modules/receiptGenerator/textReceiptGenerator/formatters/formatters.md)

## Встановлення
Для встановлення цього пакету використовуйте npm:
```bash
  npm install poster-prro-kit
```
