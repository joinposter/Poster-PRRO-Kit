import {
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_Z_REPORT,
} from "../const/receipt.js";
import getFiscalCompanyData from "../templateBlocks/fiscalCompanyBlock.js";
import getSmartXZReceiptFooterBlock from "../templateBlocks/smartXZReceiptFooterBlock.js";
import { getDateTime, sortByProgram } from "../../../helpers/common.js";
import { priceFormat } from "../helpers/receipt.js";
import { findCashPaymentData } from "../helpers/receiptData.js";
import {
  getTaxSum,
  getTaxTurnover,
  getPaymentSum,
  convertKopecksToGrivnas,
} from "../../../helpers/centsFormat.js";

const getTaxData = (taxes, styles) => {
  if (!taxes) return [];
  return [...taxes].sort(sortByProgram).reduce((acc, tax) => {
    const name = {
      type: "text",
      value: `${tax.name} ${tax.program} ${tax.percent}%`,
      extraCssClass:
        "m-2 mb-0 p-3 pt-1 pb-1 bg-light border-bottom rounded-top",
    };
    const table = {
      type: "smartTable",
      extraCssClass: {
        wrapper: "m-2 mb-2 mt-0 p-2 pt-0 pb-1 bg-light rounded-bottom",
        table: "mb-0",
      },
      hideTopBorder: true,
      items: [
        { row: ["Сума податку", priceFormat(getTaxSum(tax))], styles },
        {
          row: [
            "Обіг без податку",
            priceFormat(getTaxTurnover(tax) - getTaxSum(tax)),
          ],
          styles,
        },
        {
          row: ["Обіг за податком", priceFormat(getTaxTurnover(tax))],
          styles,
        },
      ],
    };
    return acc.concat([name, table]);
  }, []);
};

const getTitle = ({ type, cashboxData }, isHtml) => {
  if (type === DOCUMENT_TYPE_X_REPORT) return isHtml ? null : "X-звіт";
  if (type === DOCUMENT_TYPE_Z_REPORT)
    return `Z-звіт №${cashboxData.shiftNumber}`;
  return null;
};

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });

const getPayment = (payment, styles) =>
  payment
    ? {
        row: [payment.payFormName, priceFormat(getPaymentSum(payment))],
        styles,
      }
    : null;

const xzReportHeaderData = (data, isHtml) =>
  [
    getTitle(data, isHtml)
      ? { type: "text", value: getTitle(data), align: "center" }
      : null,
    {
      type: "smartTable",
      extraCssClass: {
        wrapper: "bg-light p-2 pt-1 pb-1 rounded",
        table: "mb-0",
      },
      items: [
        {
          row: [
            "Зміна відкрита",
            getDateTime({ date: data?.shiftOpenData?.dateTime || "" }),
          ],
          styles: {
            0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
            1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
          },
        },
        {
          row: [
            "Останній фіскальний чек",
            getDateTime({ date: data?.lastFiscalDocumentData?.dateTime }) || "",
          ],
          styles: {
            0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
            1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
          },
        },
        {
          row: [
            "Фіскальний номер останього чеку",
            data?.lastFiscalDocumentData?.fiscalId || "",
          ],
          styles: {
            0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
            1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
          },
        },
        {
          row: ["Валюта звіту", data.receiptConfig.currency],
          styles: {
            0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
            1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
          },
        },
      ],
    },
  ].filter(Boolean);

const xzReportRealizeData = (data) => [
  {
    type: "text",
    value: "Продаж",
    align: "center",
    bold: true,
    extraCssClass: "mt-4 mb-1 pt-4 border-top",
  },
  {
    type: "smartTable",
    extraCssClass: { wrapper: "p-2 pt-0 pb-0", table: "mb-0" },
    items: [
      {
        row: [
          "Загальний обіг",
          priceFormat(
            convertKopecksToGrivnas(
              data?.realiz?.sum?.isInCents
                ? data.realiz.sum.value
                : data?.realiz?.sum || 0,
            ),
          ),
        ],
        styles: {
          1: { extraCssClass: "text-end" },
        },
      },
      ...(data?.realiz?.payments
        ? data.realiz.payments.map((p) =>
            getPayment(p, {
              0: { extraCssClass: "w-50 pt-0 pb-0" },
              1: { extraCssClass: "text-end pt-0 pb-0" },
            }),
          )
        : [null]),
      {
        row: ["Кількість чеків", data?.realiz?.receiptCount || "0"],
        styles: {
          1: { extraCssClass: "text-end" },
        },
      },
    ].filter(Boolean),
  },
  ...getTaxData(data?.realiz?.taxes, {
    0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
    1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
  }),
];

const xzReportReturnData = (data) => [
  {
    type: "text",
    value: "Повернення",
    align: "center",
    bold: true,
    extraCssClass: "mt-4 mb-1 pt-4 border-top",
  },
  {
    type: "smartTable",
    extraCssClass: { wrapper: "p-2 pt-0 pb-0", table: "mb-0" },
    items: [
      {
        row: [
          "Загальний обіг",
          priceFormat(
            convertKopecksToGrivnas(
              data?.return?.sum?.isInCents
                ? data.return.sum.value
                : data?.return?.sum || 0,
            ),
          ),
        ],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
      ...(data?.return?.payments
        ? data.return.payments
            .map((p) =>
              getPayment(p, {
                0: { extraCssClass: "w-50 pt-0 pb-0" },
                1: { extraCssClass: "text-end pt-0 pb-0" },
              }),
            )
            .filter(Boolean)
        : [null]),
      {
        row: ["Кількість чеків", data?.return?.receiptCount || "0"],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
    ].filter(Boolean),
  },
  ...getTaxData(data?.return?.taxes, {
    0: { extraCssClass: "w-50 bg-light pt-0 pb-0" },
    1: { extraCssClass: "text-end bg-light pt-0 pb-0" },
  }),
];

const calcBalance = (data) => {
  const realizData = data.realiz;
  const returnData = data.return;
  const cashPaymentData = realizData?.payments.find(findCashPaymentData);
  const cashRefundData = returnData?.payments.find(findCashPaymentData);

  const cashPaymentsSum = cashPaymentData?.sum || 0;
  const cashRefundsSum = cashRefundData?.sum || 0;

  const shiftOpenDataBalanceSum = data.shiftOpenData.balance?.isInCents
    ? data.shiftOpenData.balance.value
    : data.shiftOpenData.balance || 0;

  const serviceInputSum = data.serviceInput?.isInCents
    ? data.serviceInput.value
    : data.serviceInput?.sum || 0;

  const serviceOutputSum = data.serviceOutput?.isInCents
    ? data.serviceOutput.value
    : data.serviceOutput?.sum || 0;

  return (
    shiftOpenDataBalanceSum +
    cashPaymentsSum +
    serviceInputSum +
    serviceOutputSum -
    cashRefundsSum
  );
};

const cashFlowData = (data) => [
  {
    type: "text",
    value: "Готівкові кошти в касі",
    align: "center",
    bold: true,
    extraCssClass: "mt-4 mb-1 pt-4 pt-1 pb-1 border-top",
  },
  {
    type: "smartTable",
    extraCssClass: { wrapper: "p-2 pt-0 pb-0" },
    items: [
      {
        row: [
          "Початковий залишок",
          priceFormat(
            convertKopecksToGrivnas(
              data.shiftOpenData.balance?.isInCents
                ? data.shiftOpenData.balance.value
                : data.shiftOpenData.balance,
            ),
          ),
        ],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
      {
        row: [
          "Службове внесення",
          priceFormat(
            convertKopecksToGrivnas(
              data.serviceInput?.isInCents
                ? data.serviceInput.value
                : data.serviceInput?.sum || 0,
            ),
          ),
        ],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
      {
        row: [
          "Службове вилучення",
          priceFormat(
            Math.abs(
              convertKopecksToGrivnas(
                data.serviceOutput?.isInCents
                  ? data.serviceOutput.value
                  : data.serviceOutput?.sum || 0,
              ),
            ),
          ),
        ],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
      {
        row: [
          "Кінцевий залишок",
          priceFormat(convertKopecksToGrivnas(calcBalance(data))),
        ],
        styles: {
          0: { extraCssClass: "w-50 pt-0 pb-0" },
          1: { extraCssClass: "text-end pt-0 pb-0" },
        },
      },
    ],
  },
];

const getXZReportData = (data, isHtml) => [
  ...fiscalCompanyData(data),
  ...xzReportHeaderData(data, isHtml),
  ...xzReportRealizeData(data),
  ...xzReportReturnData(data),
  ...cashFlowData(data),
  ...getSmartXZReceiptFooterBlock(
    {
      ...data,
      dateTime: getDateTime({ date: data.dateTime }),
      footerData: {
        docType:
          data.type === DOCUMENT_TYPE_Z_REPORT
            ? "ФІСКАЛЬНИЙ ДОКУМЕНТ"
            : "СЛУЖБОВИЙ ДОКУМЕНТ",
        software: "Poster POS",
        isOffline: data?.cashboxData?.isOffline,
      },
    },
    isHtml,
  ),
];

export default getXZReportData;
