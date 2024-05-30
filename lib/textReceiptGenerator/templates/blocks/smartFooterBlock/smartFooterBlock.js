import textFooterBlock from "./textFooterBlock.js";
import htmlFooterBlock from "./htmlFooterBlock.js";

const getSmartFooterBlock = (data) => {
  const { isHtml } = data;
  return isHtml ? htmlFooterBlock(data) : textFooterBlock(data);
};

export default getSmartFooterBlock;
