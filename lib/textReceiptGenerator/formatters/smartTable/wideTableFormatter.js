import { table, getBorderCharacters } from "table";

const wideTableFormatter = (chunk, config, formatters) => {
  const data = prepareData(chunk);
  const tableOutput = table(data, getConfig(chunk, config));
  return `${formatters.ruler("")}\n${tableOutput}`;
};

const prepareHeader = (chunk) => {
  if (!chunk.headers || chunk.headersHidden) return [];

  const rowHeader = chunk.headers.map(extractName);
  const filler = Array(chunk.headers.length).fill(" ");

  return [rowHeader, filler];
};

const prepareBody = (chunk) => chunk.items;

const prepareData = (chunk) => [...prepareHeader(chunk), ...prepareBody(chunk)];

const calculateAlignment = (index, length, header) =>
  header?.alignment || (index === length - 1 ? "right" : "left");

const extractName = (item) => item.name;

const accRelations = (sum, currentValue) => sum + currentValue.relation;

const getColumnsConfig = (chunk, width) => {
  const numberOfPieces =
    chunk.headers?.reduce(accRelations, 0) || chunk.items[0].length;
  const widthOfPiece = width / numberOfPieces;

  return chunk.items[0].map((_, index, arr) => {
    const header = chunk.headers?.[index];
    const length = header ? chunk.headers.length : arr.length;
    const alignment = calculateAlignment(index, length, header);
    const currentRelation = header ? header.relation : 1;

    return {
      alignment,
      width: Math.floor(widthOfPiece * currentRelation),
      wrapWord: true,
    };
  });
};

const getConfig = (chunk, config) => {
  const { width } = config;

  return {
    columns: getColumnsConfig(chunk, width),
    border: getBorderCharacters("void"),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    drawHorizontalLine: () => false,
  };
};

export default wideTableFormatter;
