import xml2js from "xml2js";
import iconv from "iconv-lite";
import { XML_ENCODING } from "./const/xml.js";
import { pipe } from "../../helpers/functional.js";
import {
  DOCUMENT_TYPE_OFFLINE_FINISH,
  DOCUMENT_TYPE_OFFLINE_START,
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SERVICE_ENTRY,
  DOCUMENT_TYPE_SHIFT_CLOSE,
  DOCUMENT_TYPE_SHIFT_OPEN,
  DOCUMENT_TYPE_Z_REPORT,
} from "./const/request.js";
import { sha256 } from "./helpers/xmlGenerator.js";
import getReceiptDocument from "./generators/receiptXMLGenerator.js";
import getServiceTransactionDocument from "./generators/serviceTransactionXMLGenerator.js";
import getOfflineStartDocument from "./generators/offlineStartXMLGenerator.js";
import getOfflineFinishDocument from "./generators/offlineFinishXMLGenerator.js";
import getZReportDocument from "./generators/zReportXMLGenerator.js";
import getShiftCloseDocument from "./generators/shiftCloseXMLGenerator.js";
import getShiftOpenDocument from "./generators/shiftOpenXMLGenerator.js";

const builder = new xml2js.Builder({ xmldec: { encoding: XML_ENCODING } });

const encodeXml = (xml) => {
  const encodedXml = iconv.encode(xml, XML_ENCODING);
  return encodedXml.toString("base64");
};

const XMLToObject = xml2js.parseStringPromise;

const buildDocumentForSigning = pipe(
  (data) => builder.buildObject(data),
  encodeXml,
);

const getDocumentHash = pipe(buildDocumentForSigning, sha256);

const getDocument = (request) => {
  const { type: requestType } = request;
  const documentsGetterMap = {
    [DOCUMENT_TYPE_SHIFT_OPEN]: getShiftOpenDocument,
    [DOCUMENT_TYPE_RECEIPT]: getReceiptDocument,
    [DOCUMENT_TYPE_RETURN_RECEIPT]: getReceiptDocument,
    [DOCUMENT_TYPE_SERVICE_ENTRY]: getServiceTransactionDocument,
    [DOCUMENT_TYPE_SERVICE_DELIVERY]: getServiceTransactionDocument,
    [DOCUMENT_TYPE_OFFLINE_START]: getOfflineStartDocument,
    [DOCUMENT_TYPE_OFFLINE_FINISH]: getOfflineFinishDocument,
    [DOCUMENT_TYPE_Z_REPORT]: getZReportDocument,
    [DOCUMENT_TYPE_SHIFT_CLOSE]: getShiftCloseDocument,
  };

  return documentsGetterMap[requestType]
    ? documentsGetterMap[requestType](request)
    : {};
};

export { XMLToObject, getDocument, getDocumentHash };
