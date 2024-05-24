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

const NEW_LINE = "\n";

const narrowTableFormatter = (chunk, config, formatters) => {
  const { items } = chunk;
  const prepareRowMapper = (item) => prepareRow(formatters, item, config);

  const tableOutput = items.map(prepareRowMapper).join(NEW_LINE);
  return chunk.hideTopBorder
    ? tableOutput
    : `${formatters.ruler()}${NEW_LINE}${tableOutput}`;
};

const prepareRow = (formatters, item, config) => {
  const { width } = config;
  const [nameValue] = item;
  const propertiesValue = item.slice(1, item.length).join(" ");

  if (nameValue.length + propertiesValue.length + 1 > width) {
    const name = formatters.text({ value: nameValue, align: "left" });
    const properties = formatters.text({
      value: propertiesValue,
      align: "right",
    });

    return `${name}${NEW_LINE}${properties}`;
  }

  const propsWidth = propertiesValue.length;
  return table([[nameValue, propertiesValue]], getConfig(width, propsWidth));
};

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
