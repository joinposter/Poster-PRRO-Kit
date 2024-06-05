import xml2js from "xml2js";
import { XML_ENCODING } from "./const/xml.js";
import { getReceiptDocument } from "./generators/receiptXMLGenerator.js";
import { getDateTimeFields } from "./generators/commonXMLTagGenerator.js";
import { getShiftOpenDocument } from "./generators/shiftOpenXMLGenerator.js";
import { getZReportDocument } from "./generators/zReportXMLGenerator.js";
import { getTaxesData, getTaxPrograms } from "../taxes/index.js";
import { cashboxData, receiptRequestData, zReportData } from "./mock/data.js";
import { mockCustomTaxes } from "../taxes/mock/taxes.js";

describe("XMLDocuments", () => {
  describe("receiptXMLGenerator", () => {
    describe("getDateTime", () => {
      it("should return date and time if data has ISO format", () => {
        expect(getDateTimeFields("2024-04-11T12:33:11")).toEqual({
          ORDERDATE: "11042024",
          ORDERTIME: "123311",
        });
      });
      it("should return empty data if uses incorrect format", () => {
        expect(getDateTimeFields("2024-04-11-12-33-11")).toEqual({
          ORDERDATE: "",
          ORDERTIME: "",
        });
      });
    });

    describe("xml2js builder", () => {
      const builder = new xml2js.Builder({
        xmldec: { encoding: XML_ENCODING },
      });

      it("should generate valid receipt XML, with a correct tag's order", () => {
        const taxesConfig = getTaxPrograms(mockCustomTaxes);
        const taxes = getTaxesData(taxesConfig)(receiptRequestData.products);
        const data = getReceiptDocument({
          ...receiptRequestData,
          dateTime: "2024-04-18T15:16:17",
          uid: "11111111-1111-1111-1111-111111111111",
          cashboxData,
          taxes,
        });
        expect(builder.buildObject(data)).toBe(
          '<?xml version="1.0" encoding="windows-1251"?>\n' +
            "<CHECK>\n" +
            "  <CHECKHEAD>\n" +
            "    <DOCTYPE>0</DOCTYPE>\n" +
            "    <DOCSUBTYPE>0</DOCSUBTYPE>\n" +
            "    <UID>11111111-1111-1111-1111-111111111111</UID>\n" +
            "    <TIN>44657555</TIN>\n" +
            "    <ORGNM>ТОВ ТЕСТ ПРРО</ORGNM>\n" +
            "    <POINTNM>кафе Ромашка</POINTNM>\n" +
            "    <POINTADDR>Дніпропетровська область, м. Дніпро, вул. Шевченка, 1</POINTADDR>\n" +
            "    <ORDERDATE>18042024</ORDERDATE>\n" +
            "    <ORDERTIME>151617</ORDERTIME>\n" +
            "    <ORDERNUM>1</ORDERNUM>\n" +
            "    <CASHDESKNUM>123</CASHDESKNUM>\n" +
            "    <CASHREGISTERNUM>4000438533</CASHREGISTERNUM>\n" +
            "    <CASHIER>Шевченко Т.Г.</CASHIER>\n" +
            "    <VER>1</VER>\n" +
            "    <ORDERTAXNUM>23649865.1.1954</ORDERTAXNUM>\n" +
            "    <OFFLINE>true</OFFLINE>\n" +
            "    <PREVDOCHASH>685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40</PREVDOCHASH>\n" +
            "    <TESTING>true</TESTING>\n" +
            "  </CHECKHEAD>\n" +
            "  <CHECKTOTAL>\n" +
            "    <SUM>950.04</SUM>\n" +
            "    <DISCOUNTSUM>50.35</DISCOUNTSUM>\n" +
            "  </CHECKTOTAL>\n" +
            "  <CHECKPAY>\n" +
            '    <ROW ROWNUM="1">\n' +
            "      <PAYFORMCD>0</PAYFORMCD>\n" +
            "      <PAYFORMNM>ГОТІВКА</PAYFORMNM>\n" +
            "      <SUM>100.00</SUM>\n" +
            "      <PROVIDED>100.00</PROVIDED>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="2">\n' +
            "      <PAYFORMCD>1</PAYFORMCD>\n" +
            "      <PAYFORMNM>КАРТКА</PAYFORMNM>\n" +
            "      <SUM>850.04</SUM>\n" +
            "      <PROVIDED>850.04</PROVIDED>\n" +
            "    </ROW>\n" +
            "  </CHECKPAY>\n" +
            "  <CHECKTAX>\n" +
            '    <ROW ROWNUM="1">\n' +
            "      <TYPE>5</TYPE>\n" +
            "      <NAME>Акциз</NAME>\n" +
            "      <LETTER>Д</LETTER>\n" +
            "      <PRC>5.00</PRC>\n" +
            "      <TURNOVER>980.26</TURNOVER>\n" +
            "      <SOURCESUM>930.26</SOURCESUM>\n" +
            "      <SUM>44.30</SUM>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="2">\n' +
            "      <TYPE>4</TYPE>\n" +
            "      <NAME>ПДВ 0%</NAME>\n" +
            "      <LETTER>Г</LETTER>\n" +
            "      <PRC>0.00</PRC>\n" +
            "      <TURNOVER>800.00</TURNOVER>\n" +
            "      <SOURCESUM>770.00</SOURCESUM>\n" +
            "      <SUM>0.00</SUM>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="3">\n' +
            "      <TYPE>2</TYPE>\n" +
            "      <NAME>ПДВ 7%</NAME>\n" +
            "      <LETTER>Б</LETTER>\n" +
            "      <PRC>7.00</PRC>\n" +
            "      <TURNOVER>180.26</TURNOVER>\n" +
            "      <SOURCESUM>160.26</SOURCESUM>\n" +
            "      <SUM>9.99</SUM>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="4">\n' +
            "      <TYPE>3</TYPE>\n" +
            "      <NAME>ПДВ 20%</NAME>\n" +
            "      <LETTER>В</LETTER>\n" +
            "      <PRC>20.00</PRC>\n" +
            "      <TURNOVER>20.13</TURNOVER>\n" +
            "      <SOURCESUM>19.78</SOURCESUM>\n" +
            "      <SUM>3.30</SUM>\n" +
            "    </ROW>\n" +
            "  </CHECKTAX>\n" +
            "  <CHECKBODY>\n" +
            '    <ROW ROWNUM="1">\n' +
            "      <CODE>54</CODE>\n" +
            "      <NAME>Сирна паличка</NAME>\n" +
            "      <UNITNM>шт</UNITNM>\n" +
            "      <AMOUNT>4</AMOUNT>\n" +
            "      <PRICE>200.00</PRICE>\n" +
            "      <LETTERS>ГД</LETTERS>\n" +
            "      <COST>800.00</COST>\n" +
            "      <DISCOUNTTYPE>0</DISCOUNTTYPE>\n" +
            "      <DISCOUNTSUM>30.00</DISCOUNTSUM>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="2">\n' +
            "      <CODE>55</CODE>\n" +
            "      <NAME>Морозиво</NAME>\n" +
            "      <UNITNM>шт</UNITNM>\n" +
            "      <AMOUNT>2</AMOUNT>\n" +
            "      <PRICE>90.13</PRICE>\n" +
            "      <LETTERS>БД</LETTERS>\n" +
            "      <COST>180.26</COST>\n" +
            "      <DISCOUNTTYPE>0</DISCOUNTTYPE>\n" +
            "      <DISCOUNTSUM>20.00</DISCOUNTSUM>\n" +
            "    </ROW>\n" +
            '    <ROW ROWNUM="3">\n' +
            "      <CODE>56</CODE>\n" +
            "      <NAME>Кава</NAME>\n" +
            "      <UNITNM>шт</UNITNM>\n" +
            "      <AMOUNT>1</AMOUNT>\n" +
            "      <PRICE>20.13</PRICE>\n" +
            "      <LETTERS>В</LETTERS>\n" +
            "      <COST>20.13</COST>\n" +
            "      <DISCOUNTTYPE>0</DISCOUNTTYPE>\n" +
            "      <DISCOUNTSUM>0.35</DISCOUNTSUM>\n" +
            "    </ROW>\n" +
            "  </CHECKBODY>\n" +
            "</CHECK>",
        );
      });
    });
  });
  describe("shiftOpenXMLGenerator", () => {
    describe("xml2js builder", () => {
      const builder = new xml2js.Builder({
        xmldec: { encoding: XML_ENCODING },
      });
      const data = {
        type: "shiftOpen",
        dateTime: "2024-04-18T15:16:17",
        uid: "11111111-1111-1111-1111-111111111111",
        cashboxData: {
          tin: 44657555,
          name: "ТОВ ТЕСТ ПРРО",
          pointName: "кафе Ромашка",
          pointAddress: "Дніпропетровська область, м. Дніпро, вул. Шевченка, 1",
          cashbox: "4000438533",
          cashboxLocalNumber: "123",
          isCashboxModeOffline: true,
          getOfflineSessionData: {
            id: 23649865,
            seed: 135969449201653,
          },
          documentNumber: 1,
          offlineDocumentNumber: 1,
          previousDocumentHash:
            "685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40",
        },
      };
      it("getShiftOpenDocument should generate shiftOpen valid XML, with a correct tag's order", async () => {
        const shiftOpenData = await getShiftOpenDocument(data);
        expect(builder.buildObject(shiftOpenData)).toBe(
          '<?xml version="1.0" encoding="windows-1251"?>\n' +
            "<CHECK>\n" +
            "  <CHECKHEAD>\n" +
            "    <DOCTYPE>100</DOCTYPE>\n" +
            "    <UID>11111111-1111-1111-1111-111111111111</UID>\n" +
            "    <TIN>44657555</TIN>\n" +
            "    <ORGNM>ТОВ ТЕСТ ПРРО</ORGNM>\n" +
            "    <POINTNM>кафе Ромашка</POINTNM>\n" +
            "    <POINTADDR>Дніпропетровська область, м. Дніпро, вул. Шевченка, 1</POINTADDR>\n" +
            "    <ORDERDATE>18042024</ORDERDATE>\n" +
            "    <ORDERTIME>151617</ORDERTIME>\n" +
            "    <ORDERNUM>1</ORDERNUM>\n" +
            "    <CASHDESKNUM>123</CASHDESKNUM>\n" +
            "    <CASHREGISTERNUM>4000438533</CASHREGISTERNUM>\n" +
            "    <CASHIER>Шевченко Т.Г.</CASHIER>\n" +
            "    <VER>1</VER>\n" +
            "    <ORDERTAXNUM>23649865.1.3650</ORDERTAXNUM>\n" +
            "    <OFFLINE>true</OFFLINE>\n" +
            "    <PREVDOCHASH>685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40</PREVDOCHASH>\n" +
            "    <TESTING>true</TESTING>\n" +
            "  </CHECKHEAD>\n" +
            "</CHECK>",
        );
      });
    });
  });
  describe("zReportXMLGenerator", () => {
    describe("xml2js builder", () => {
      const builder = new xml2js.Builder({
        xmldec: { encoding: XML_ENCODING },
      });

      it("should generate valid z-report XML, with a correct tag's order", async () => {
        const data = await getZReportDocument({
          ...zReportData,
          dateTime: "2024-04-18T15:16:17",
          uid: "11111111-1111-1111-1111-111111111111",
          cashboxData,
        });
        expect(builder.buildObject(data)).toBe(
          '<?xml version="1.0" encoding="windows-1251"?>\n' +
            "<ZREP>\n" +
            "  <ZREPHEAD>\n" +
            "    <UID>11111111-1111-1111-1111-111111111111</UID>\n" +
            "    <TIN>44657555</TIN>\n" +
            "    <ORGNM>ТОВ ТЕСТ ПРРО</ORGNM>\n" +
            "    <POINTNM>кафе Ромашка</POINTNM>\n" +
            "    <POINTADDR>Дніпропетровська область, м. Дніпро, вул. Шевченка, 1</POINTADDR>\n" +
            "    <ORDERDATE>18042024</ORDERDATE>\n" +
            "    <ORDERTIME>151617</ORDERTIME>\n" +
            "    <ORDERNUM>1</ORDERNUM>\n" +
            "    <CASHDESKNUM>123</CASHDESKNUM>\n" +
            "    <CASHREGISTERNUM>4000438533</CASHREGISTERNUM>\n" +
            "    <CASHIER>Шевченко Т.Г.</CASHIER>\n" +
            "    <VER>1</VER>\n" +
            "    <ORDERTAXNUM>23649865.1.3650</ORDERTAXNUM>\n" +
            "    <OFFLINE>true</OFFLINE>\n" +
            "    <PREVDOCHASH>685df9bd624bde3dfb25c40c1d80583e60fe1d6ec6f4932343d79abb1aecab40</PREVDOCHASH>\n" +
            "    <TESTING>true</TESTING>\n" +
            "  </ZREPHEAD>\n" +
            "  <ZREPREALIZ>\n" +
            "    <SUM>27710.69</SUM>\n" +
            "    <ORDERSCNT>87</ORDERSCNT>\n" +
            "    <PAYFORMS>\n" +
            '      <ROW ROWNUM="1">\n' +
            "        <PAYFORMCD>0</PAYFORMCD>\n" +
            "        <PAYFORMNM>ГОТІВКА</PAYFORMNM>\n" +
            "        <SUM>8700.00</SUM>\n" +
            "      </ROW>\n" +
            '      <ROW ROWNUM="2">\n' +
            "        <PAYFORMCD>1</PAYFORMCD>\n" +
            "        <PAYFORMNM>КАРТКА</PAYFORMNM>\n" +
            "        <SUM>19010.69</SUM>\n" +
            "      </ROW>\n" +
            "    </PAYFORMS>\n" +
            "    <TAXES>\n" +
            '      <ROW ROWNUM="1">\n' +
            "        <TYPE>2</TYPE>\n" +
            "        <NAME>ПДВ 20%</NAME>\n" +
            "        <LETTER>Б</LETTER>\n" +
            "        <PRC>20.00</PRC>\n" +
            "        <TURNOVER>4506.50</TURNOVER>\n" +
            "        <SUM>901.50</SUM>\n" +
            "      </ROW>\n" +
            '      <ROW ROWNUM="2">\n' +
            "        <TYPE>5</TYPE>\n" +
            "        <NAME>Акциз 5%</NAME>\n" +
            "        <LETTER>Д</LETTER>\n" +
            "        <PRC>5.00</PRC>\n" +
            "        <TURNOVER>20900.94</TURNOVER>\n" +
            "        <SUM>1019.05</SUM>\n" +
            "      </ROW>\n" +
            '      <ROW ROWNUM="3">\n' +
            "        <TYPE>4</TYPE>\n" +
            "        <NAME>ПДВ 20%</NAME>\n" +
            "        <LETTER>Г</LETTER>\n" +
            "        <PRC>20.00</PRC>\n" +
            "        <TURNOVER>3777.33</TURNOVER>\n" +
            "        <SUM>603.22</SUM>\n" +
            "      </ROW>\n" +
            "    </TAXES>\n" +
            "  </ZREPREALIZ>\n" +
            "  <ZREPBODY>\n" +
            "    <SERVICEINPUT>0.00</SERVICEINPUT>\n" +
            "    <SERVICEOUTPUT>0.00</SERVICEOUTPUT>\n" +
            "  </ZREPBODY>\n" +
            "</ZREP>",
        );
      });
    });
  });
});
