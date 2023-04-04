export type EdgarFiling = {
  id: string;
  accessionNo: string;
  cik: string;
  ticker: string;
  companyName: string;
  companyNameLong: string;
  formType: string;
  description: string;
  filedAt: string;
  linkToTxt: string;
  linkToHtml: string;
  linkToXbrl: string;
  linkToFilingDetails: string;
  entities: Array<{
    companyName: string;
    cik: string;
    irsNo: string;
    stateOfIncorporation: string;
    fiscalYearEnd: string;
    type: string;
    act: string;
    fileNo: string;
    filmNo: string;
    sic: string;
  }>;
  documentFormatFiles: Array<{
    sequence: string;
    description: string;
    documentUrl: string;
    type: string;
    size: string;
  }>;
  dataFiles: Array<{
    sequence: string;
    description: string;
    documentUrl: string;
    type: string;
    size: string;
  }>;
  seriesAndClassesContractsInformation: Array<any>;
  periodOfReport: string;
};
