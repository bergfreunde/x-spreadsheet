import Spreadsheet from './src';

const initialCols = [
  'VendorID',
  'SeasonID',
  'ProductID',
  'Fehler',
  'Fehler ignorieren?',
  'Marke',
  'Artikelname',
  'Herstellerartikelnummer',
  'Farbcode',
  'Größencode',
  'H-SKU',
  'EAN',
  'UPC',
  'Code 128',
  'Sonstige Codes',
  'Größensystem',
  'Größe1',
  'Größe2',
  'Sonstiges',
  'Farbbezeichnung',
  'Formelspalte1',
  'Geschlecht',
  'Mwst.',
  'FEDAS/eigenes Kategoriesystem',
  'VPE',
  'EK',
  'UVP DE EUR',
  'UVP UK GBP',
  'UVP CH CHF',
  'UVP FR EUR',
  'UVP NL EUR',
  'UVP DK EUR',
  'UVP NO EUR',
  'UVP SE EUR',
  'UVP FI EUR',
  'UVP IT EUR',
  'UVP ESP EUR',
  'UVP CH EUR',
  'UVP AT EUR',
  'NOS (0/1)',
  'Gefahrgut (J/N)',
  'Gefahrstoff (J/N)',
  'URL',
  'Zutaten/Nährwerte',
  'Materialzusammensetzung',
  'Zolltarifnummer DE',
  'Ursprungsland',
  'Erzeugerland',
  'Netto-Produktgewicht (kg)',
  'Brutto-Produktgewicht (kg)',
  'Verpackungshöhe (cm)',
  'Verpackungsbreite (cm)',
  'Verpackungslänge (cm)',
  'Verpackungsart',
  'Kollektion',
  'Live-Datum',
  'Business Unit',
  'Bemerkung',
  'IST-Saison',
  'K 1',
  'K 2',
  'K 3',
  'K1 Text',
  'Bergfreunde SKU',
  'Datum Import',
  'User Import',
  'Datum Änderung',
  'User Änderung',
  'Bestellmenge',
  'Hat Produktstatus',
  'CHECKSUM_OLD',
  'CHECKSUM_NEW',
  'Löschen',
  'Hilfsspalte',
];

const cells = initialCols.reduce((acc, cur, i) => ({
  ...acc,
  [i]: { text: cur, style: 0 },
}), {});

const obj = {
  0: { text: 80490 },
  1: { text: 324 },
  2: { text: 7 },
  3: { text: 36 },
  4: { text: 'adidas' },
  5: { text: 'ADISSAGE' },
  6: { text: '78260' },
  7: { text: '' },
  8: { text: '' },
  9: { text: '' },
  10: { text: '4003420221129' },
  11: { text: '060595167748' },
  12: { text: '' },
  13: { text: '' },
  14: { text: null },
  15: { text: '35' },
  16: { text: '' },
  17: { text: 'BLACK/BLACK/RUNNING WHITE FTW' },
  18: { text: 'M' },
  19: { text: '315901' },
  20: { text: 1 },
  21: { text: '15.0000' },
  22: { text: '29.9500' },
  23: { text: 0 },
  24: { text: 0 },
  25: { text: 0 },
  26: { text: '' },
  27: { text: '' },
  28: { text: '' },
  29: { text: '640299390000' },
  30: { text: 'VIETNAM' },
  31: { text: '' },
  32: { text: null },
  33: { text: null },
  34: { text: null },
  35: { text: null },
  36: { text: null },
  37: { text: '' },
  38: { text: '' },
  39: { text: null },
  40: { text: '00' },
  41: { text: null },
  42: { text: '' },
  43: { text: '02550' },
  44: { text: '' },
  45: { text: '' },
  46: { text: '' },
};

const rowLength = 56;
const rows = new Array(rowLength)
  .fill(obj)
  .map((elm, i) => ({
    [i + 1]: {
      cells: {
        ...(Object.entries(elm).reduce((acc, [key, { text }]) => ({
          ...acc,
          [key]: { text },
        }), {})),
      },
    },
  })).reduce((acc, curr) => ({
    ...acc,
    ...curr,
  }), {});

const instance = new Spreadsheet('#x-spreadsheet-demo');
instance.on('cell-selected', (cell, ri, ci) => {
  console.log({ cell, ri, ci });
});

const numberFormat = { format: 'number' };
const excludeRows = [{ property: 'style', indices: [0] }];

instance.loadData([
  {
    freeze: 'A2',
    cols: {
      len: initialCols.length,
      0: { style: numberFormat, editable: false, excludeRows },
      3: { style: numberFormat, excludeRows },
      7: { width: 250 },
    },
    styles: [
      {
        font: { bold: true },
        border: {
          bottom: ['medium', '#000'],
        },
      },
    ],
    rows: {
      len: rowLength + 1,
      0: { cells },
      ...rows,
    },
  },
]);
