// Require library
const xl = require('excel4node');

const createxlFile = (data, filePath) => {
  // Create a new instance of a Workbook class
  const wb = new xl.Workbook();

  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('Export Data');
  // var ws2 = wb.addWorksheet('Sheet 2');

  // Create a reusable style
  // var style = wb.createStyle({
  //   font: {
  //     color: '#FF0800',
  //     size: 12
  //   },
  //   numberFormat: '$#,##0.00; ($#,##0.00); -'
  // });

  // Write Header
  ws.cell(1, 1).string('Cert ID');
  ws.cell(1, 2).string('Flow Meter Id');
  ws.cell(1, 3).string('Landowner');

  let x = 2;

  data.map(cert => {
    ws.cell(x, 1).string(cert.Cert_ID);
    ws.cell(x, 2).string(cert.fm_id);

    if (cert.name !== null) {
      ws.cell(x, 3).string(cert.name);
    }
    x += 1;
  });

  // Set value of cell A1 to 100 as a number type styled with parameters of style
  // ws.cell(1, 1)
  //   .number(100)
  //   .style(style);

  // Set value of cell B1 to 200 as a number type styled with parameters of style
  // ws.cell(1, 2)
  //   .number(200)
  //   .style(style);

  // Set value of cell C1 to a formula styled with parameters of style
  // ws.cell(1, 3)
  //   .formula('A1 + B1')
  //   .style(style);

  // Set value of cell A2 to 'string' styled with parameters of style
  // ws.cell(2, 1)
  //   .string('string')
  //   .style(style);

  // Set value of cell A3 to true as a boolean type styled with parameters of style but with an adjustment to the font size.
  // ws.cell(3, 1)
  //   .bool(true)
  //   .style(style)
  //   .style({ font: { size: 14 } });

  // Set value in ws2 cell A3 to my name
  // ws2.cell(3, 1).string(data.first_name);
  // ws2.cell(3, 2).string(data.last_name);

  // wb.write('Excel.xlsx');
  wb.write(filePath);
};

// Creates the report for the missing flow meter reads and other info.
const flowmeterReport = (data, filePath) => {
  const wb = new xl.Workbook();

  // Add Worksheets to the workbook
  const ws = wb.addWorksheet('Export Data');

  // Write Header
  ws.cell(1, 1).string('Flowmeter ID');
  ws.cell(1, 2).string('Cert No');
  ws.cell(1, 3).string('Serial No');
  ws.cell(1, 4).string('Name');
  ws.cell(1, 5).string('Company Name');
  ws.cell(1, 6).string('Home Phone');
  ws.cell(1, 7).string('Business Phone');
  ws.cell(1, 8).string('Mobile Phone');
  ws.cell(1, 9).string('Telemetry Installed?');
  ws.cell(1, 10).string('Next Maintenance Year');

  let x = 2;

  data.map(fm => {
    ws.cell(x, 1).string(fm.FM_ID);
    ws.cell(x, 2).string(fm.Cert_No);

    if (fm.Serial_No != null) {
      ws.cell(x, 3).string(fm.Serial_No);
    }

    if (fm.Name != null) {
      ws.cell(x, 4).string(fm.Name);
    }

    if (fm.Company != null) {
      ws.cell(x, 5).string(fm.Company);
    }

    if (fm.Home_Phone != null) {
      ws.cell(x, 6).string(fm.Home_Phone);
    }

    if (fm.Business_Phone != null) {
      ws.cell(x, 7).string(fm.Business_Phone);
    }

    if (fm.Mobile_Phone != null) {
      ws.cell(x, 8).string(fm.Mobile_Phone);
    }

    ws.cell(x, 9).bool(fm.Telemetry_Installed);

    ws.cell(x, 10).number(fm.Sched_Main_WY);

    x += 1;
  });

  // wb.write('Excel.xlsx');
  wb.write(filePath);
};

// Creates the report for the reports that have been made.
const pdfFormReport = (data, filePath) => {
  const wb = new xl.Workbook();

  // Add Worksheets to the workbook
  const oa_wb = wb.addWorksheet('OA Reports');
  const fa_wb = wb.addWorksheet('FA Reports');
  const err_wb = wb.addWorksheet('Error Certs');

  // Write Header
  oa_wb.cell(1, 1).string('Cert No.');
  fa_wb.cell(1, 1).string('Cert No.');
  err_wb.cell(1, 1).string('Cert No.');

  let oa_x = 2;
  let fa_x = 2;
  let err_x = 2;

  data.map(rpt => {
    if (rpt.Cert_Details !== undefined) {
      if (rpt.Cert_Details.cert_type === 'Irrigation') {
        if (rpt.GWMA === 'OA' || rpt.GWMA === 'PC') {
          if (rpt.Cert_ID === undefined) {
          } else {
            if (rpt.Exemptions.length === 0) {
              oa_wb.cell(oa_x, 1).string(rpt.Cert_ID);
            }
          }
          oa_x += 1;
        } else if (rpt.GWMA === 'FA') {
          if (rpt.Cert_ID === undefined) {
          } else {
            fa_wb.cell(fa_x, 1).string(rpt.Cert_ID);
          }
          fa_x += 1;
        }
      }
    } else {
      if (rpt.Cert_ID === undefined) {
        err_wb.cell(err_x, 1).string('Not sure of Cert_no');
        err_x += 1;
      }
      // console.log('in error', rpt);
      err_wb.cell(err_x, 1).string(rpt.Cert_ID);
      err_x += 1;
    }
  });

  // wb.write('Excel.xlsx');
  wb.write(filePath);
  console.log('report created, finished.');
};

// Creates the report for the reports that have been made.
const DaupdfFormReport = (data, filePath) => {
  const wb = new xl.Workbook();

  // Add Worksheets to the workbook
  const dau_wb = wb.addWorksheet('DAU Reports');
  const pau_wb = wb.addWorksheet('PAU Reports');
  const err_wb = wb.addWorksheet('Error Certs');

  // Write Header
  dau_wb.cell(1, 1).string('DAU No.');
  pau_wb.cell(1, 1).string('PAU No.');
  err_wb.cell(1, 1).string('DAU / PAU No.');

  let dau_x = 2;
  let fa_x = 2;
  let err_x = 2;

  data.map(rpt => {
    dau_wb.cell(dau_x, 1).string(rpt.DAU_ID);

    dau_x += 1;
  });

  // wb.write('Excel.xlsx');
  wb.write(filePath);
  console.log('report created, finished.');
};

// Creates the report for the reports that have been made.
const PaupdfFormReport = (data, filePath) => {
  const wb = new xl.Workbook();

  // Add Worksheets to the workbook
  const dau_wb = wb.addWorksheet('DAU Reports');
  const pau_wb = wb.addWorksheet('PAU Reports');
  const err_wb = wb.addWorksheet('Error Certs');

  // Write Header
  dau_wb.cell(1, 1).string('DAU No.');
  pau_wb.cell(1, 1).string('PAU No.');
  err_wb.cell(1, 1).string('DAU / PAU No.');

  let dau_x = 2;
  let pau_x = 2;
  let err_x = 2;

  data.map(rpt => {
    pau_wb.cell(pau_x, 1).string(rpt.PAU_ID);

    pau_x += 1;
  });

  // wb.write('Excel.xlsx');
  wb.write(filePath);
  console.log('report created, finished.');
};

module.exports = {
  createxlFile,
  flowmeterReport,
  pdfFormReport,
  DaupdfFormReport,
  PaupdfFormReport
};
// multiple exports should be module.exports = {createxlFile, createOtherxlFile}
// then access like const myFunctions = require("...file.js"); myFuctions.createxlFile and myFuctions.createotherxlFile
