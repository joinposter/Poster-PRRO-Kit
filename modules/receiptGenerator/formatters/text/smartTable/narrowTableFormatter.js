import { table, getBorderCharacters } from "table";

/**
 * Data example:
 * [
 *   {
 *     type: 'smartTable',
 *     items: [
 *       { row: ['Сирна паличка', '1 шт.', '200.00грн.', '200.00грн.'] },
 *       { row: ['Морозиво', '2 шт.', '92.13грн.', '184.26грн.'] },
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

  const formatItem = (item) => {
    const additionalDataRows = (item.additionalData || [])
      .filter(Boolean)
      .map((data) => formatAdditionalData(data, config.width));
    const mainRow = prepareRowMapper(item.row);
    return [...additionalDataRows, mainRow].join("");
  };

  const tableOutput = items.map(formatItem).join("");
  return chunk.hideTopBorder
    ? tableOutput
    : `${formatters.ruler()}${NEW_LINE}${tableOutput}`;
};

const formatAdditionalData = (data, width) => {
  const dataString = data.toString();
  const paddingLength = Math.max(0, width - dataString.length);
  const padding = " ".repeat(paddingLength);
  return dataString + padding + NEW_LINE;
};

const prepareRow = (formatters, item, config) => {
  const { width } = config;
  const [nameValue, ...propertyValues] = item;
  const propertiesValue = propertyValues.join(" ") || " ";

  if (nameValue.length + propertiesValue.length + 1 > width) {
    const name = formatters.text({ value: nameValue, align: "left" });
    const properties = formatters.text({
      value: propertiesValue,
      align: "right",
    });

    return `${name}${NEW_LINE}${properties}${NEW_LINE}`;
  }

  const tableConfig = getConfig(width, propertiesValue.length);
  return table([[nameValue, propertiesValue]], tableConfig);
};

const getConfig = (width, propsWidth) => ({
  columns: [
    {
      alignment: "left",
      width: width - propsWidth,
      wrapWord: true,
    },
    {
      alignment: "right",
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
