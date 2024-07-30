## Сервіс OfflineMode 
Кожен чек, який був фіскалізован, можна знайти в кабінеті ДПС. Для генераціі цього 
посилання, в Kit був додан `getDFSFiscalLink` метод, який очикує наступні параментри:
- `fiscalId`
- `cashbox`
- `sum`
- `date`
- `time`
- `previousDocumentHash`

Приклад використання в OfflineMode сервісі:
```javascript
getDFSFiscalLink({
    fiscalId,
    cashbox: cashboxData.cashbox,
    sum: data.total,
    date: getDateTime({ date: dateTime, format: "dateDfsLink" }),
    time: getDateTime({ date: dateTime, format: "timeDfsLink" }),
    previousDocumentHash: cashboxData.offlineSessionData.lastDocumentHash,
  });
```
