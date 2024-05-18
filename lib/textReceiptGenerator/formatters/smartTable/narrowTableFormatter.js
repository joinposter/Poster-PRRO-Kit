import { table, getBorderCharacters } from "table";

/**
 * Data example:
 * [
 *   {
 *     type: 'smartTable',
 *     items: [
 *       ['Сирна паличка', '1 шт.', '200.00грн.', '200.00грн.'],
 *       ['Морозиво', '2 шт.', '92.13грн.', '184.26грн.'],
 *     ],
 *   }
 *]
 *
 * Receipt example:
 * '------------------------------',
 * 'Сирна паличка                 ',
 * '   1 шт. 200.00грн. 200.00грн.',
 * 'Морозиво                      ',
 * '    2 шт. 92.13грн. 184.26грн.',
 * Больше примеров в receipt.test.js
 */

function narrowTableFormatter(chunk) {
  const { items } = chunk;
  const res = items.map(prepareRow.bind(this)).join("\n");
  return `${this.formatters.ruler("")}\n${res}`;
}

function prepareRow(item) {
  const { width } = this.config;
  const nameValue = item[0];
  const propertiesValue = item.slice(1, item.length).join(" ");

  if (nameValue.length + propertiesValue.length + 1 > width) {
    const name = this.formatters.text({ value: nameValue, align: "left" });
    const properties = this.formatters.text({
      value: propertiesValue,
      align: "right",
    });
    return `${name}\n${properties}`;
  }

  const propsWidth = propertiesValue.length;
  return table([[nameValue, propertiesValue]], getConfig(width, propsWidth));
}

const getConfig = (width, propsWidth) => ({
  columns: [
    {
      alignment: "left",
      width: width - propsWidth,
      wrapWord: true,
    },
    {
      alignment: "left",
      width: propsWidth,
      wrapWord: true,
    },
  ],
  border: getBorderCharacters("void"),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  drawHorizontalLine: () => false,
});

export default narrowTableFormatter;
