import { table, getBorderCharacters } from "table";

const narrowTableFormatter = (chunk, config, formatters) => {
  const { items } = chunk;
  const prepareRowMapper = (item) => prepareRow(formatters, item, config);

  const res = items.map(prepareRowMapper).join("\n");
  return `${formatters.ruler("")}\n${res}`;
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

    return `${name}\n${properties}`;
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
