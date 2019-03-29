const path = require('path');

// Load xlfiles report creator
const pdfFormReport = require('./xlfiles').pdfFormReport;
const ensurePath = require('./folderPath');

// Load all the forms files
const createOAReport = require('./forms/oa_form');
const createFAReport = require('./forms/fa_form');

const whichForm = certList => {
  // loop through certList and decide which form to build
  certList.map(cert => {
    console.log(cert.Cert_ID);
    if (cert.Cert_Details !== undefined) {
      switch (cert.GWMA) {
        case 'OA':
        case 'PC':
          // Don't provide reports for Feedlots
          if (cert.Cert_Details.cert_type !== null) {
            if (cert.Cert_Details.cert_type === 'Irrigation') {
              if (cert.Exemptions.length === 0) {
                // createOAReport(cert);
              }
            }
          }
          break;
        case 'FA':
          // Don't provide reports for Feedlots
          if (cert.Cert_Details.cert_type === 'Irrigation') {
            if (cert.Exemptions.length === 0) {
              createFAReport(cert);
            }
          }
          break;
      }
    }
  });

  const filePath = path.resolve(__dirname, '../../public/xlfiles/');

  const fullfilePath = path.resolve(
    __dirname,
    `../public/xlfiles/pdfForm_Report.xlsx`
  );

  // console.log(fullfilePath);
  ensurePath(filePath);

  // create xlreport for the form creation
  pdfFormReport(certList, fullfilePath);
};

module.exports = whichForm;
