const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const math = require('mathjs');
const xl_utils = require('../xlfiles').DaupdfFormReport;
const ensurePath = require('../folderPath');

const DauProcess = data => {
  data.map(dau => {
    createDauReport(dau);
  });

  const filePath = path.resolve(__dirname, '../../public/xlfiles/');

  const fullfilePath = path.resolve(
    __dirname,
    `../../public/xlfiles/Dau_pdfForm_Report.xlsx`
  );

  // make sure folder exists, if not, this creates it.
  ensurePath(filePath);
  xl_utils(data, fullfilePath);
};

const createDauReport = data => {
  // console.log('Dau ID: ', data.DAU_ID);

  // console.log(data);
  // create pdf - probably new function
  let docDefinition = {
    header: {
      columns: [
        {
          image: path.join(
            __dirname,
            '../../',
            '/public/images/NPNRD_logo.jpg'
          ),
          width: 200
        },
        {
          text:
            'Water Year 2018 Ground Water Use / Water Year 2019 Available Water For Designated Allocation Unit (DAU)',
          alignment: 'center'
        }
      ],
      style: 'pageHeader'
    },
    footer: {
      columns: [
        `DAU ID: ${data.DAU_ID}`,
        {
          text: `Date Created: ${moment(Date.now()).format('MMMM D, YYYY')}`,
          alignment: 'right'
        }
      ],
      style: 'pageFooter'
    },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: [],
    styles: {
      pageHeader: {
        fontSize: 12,
        bold: true,
        // margin: [left, top, right, bottom]
        margin: [30, 20, 30, 0]
      },
      pageFooter: {
        fontSize: 10,
        margin: [30, 5, 30, 5]
      },
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      emphasis: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
        decoration: 'underline'
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black'
      },
      tableFooter: {
        fontSize: 9
      }
    },
    defaultStyle: {
      // alignment: 'justify'
      fontSize: 11
    }
  };

  let landowners = [];
  let otherEntities = [];
  let landowner = ['Landowner:'];

  // Find landowners
  data.Certs.map(cert => {
    cert.Entities.map(Entity => {
      // console.log('Ent ID', Entity.Id);
      if (Entity.Own_Type === 'Landowner') {
        // add landowner to landowners if not there
        const index = landowners.findIndex(
          x => String(x.Id) === String(Entity.Id)
        );
        // console.log(index);
        if (index === -1) {
          // didn't find it
          landowners.push(Entity);
        }
      } else {
        const o_index = otherEntities.findIndex(
          x => String(x.Id) === String(Entity.Id)
        );
        // console.log(index);
        if (o_index === -1) {
          // didn't find it
          otherEntities.push(Entity);
        }
      }
    });
  });

  let lo = [];
  // console.log('landowners: ', landowners);
  // console.log('others: ', otherEntities);
  // console.log('joins: ', data.joins);
  // add Entity Info to them
  landowners.map(owner => {
    data.joins.map(ent => {
      if (String(owner.Id) === String(ent._id)) {
        lo.push(Object.assign({}, owner, ent));
      }
    });
  });

  let oe = [];
  otherEntities.map(otherEnt => {
    data.joins.map(ent => {
      // console.log(String(otherEnt.Id) === String(ent._id));
      if (String(otherEnt.Id) === String(ent._id)) {
        oe.push(Object.assign({}, otherEnt, ent));
      }
    });
  });

  // console.log('LO: ', lo);
  // console.log('OE: ', oe);

  let lo_address = [];

  docDefinition.content.push('\n\n\n\n');

  lo.map(owner => {
    let own = addressMake(owner, true);
    docDefinition.content = docDefinition.content.concat(own);
    // console.log('Doc: ', docDefinition.content);
    lo_address.push(addressMake(owner));
  });

  // let oe_address = [];

  oe.map(owner => {
    let own = addressMake(owner, true);
    docDefinition.content = docDefinition.content.concat(own);
    // oe_address.push(addressMake(owner));
  });

  docDefinition.content.push({ text: '\n\n', pageBreak: 'before' });
  // console.log('lo_address: ', lo_address);

  switch (lo_address.length) {
    case 1:
      // no columns, just original
      docDefinition.content.push(lo_address[0]);
      break;
    case 2:
      // two columns
      docDefinition.content.push({
        columns: [
          {
            text: lo_address[0]
          },
          {
            text: lo_address[1]
          }
        ]
      });
      break;
    case 3:
      // three columns
      docDefinition.content.push({
        columns: [
          {
            text: lo_address[0]
          },
          {
            text: lo_address[1]
          },
          {
            text: lo_address[2]
          }
        ]
      });
      break;
  }

  docDefinition.content.push({
    text:
      'RE: Water Years 2018 Ground Water Use and Water Years 2019 Available Water Report for a Designated Allocation Unit \n\n' +
      'For your convenience, the enclosed form(s) show the Water Year 2018 ground water use and the available water ' +
      'remaining in the current allocation period on Designated Allocation Unit.\n\n'
  });

  docDefinition.content.push({
    text:
      '(DAU) comprised of the certified irrigated tracts identified by the certification numbers listed on the report. ' +
      'A DAU allows the available water for each certified irrigated tract within the DAU to be combined. The ' +
      'Certification numbers and DAU number are the numbers that have been assigned by the North Platte NRD for ' +
      'administrative purposes. The field name is the name for that tract that you have provided to the District.\n\n'
  });

  docDefinition.content.push({
    text:
      'This DAU will remain intact for the Water Years 2015-2019 allocation period, unless (1) it is relinquished ' +
      'by the landowner(s); (2) there is a change in ownership; or (3) all or a portion of the certified irrigated ' +
      'tracts are enrolled in a program requiring cessation of irrigation on any of the certified irrigated tracts ' +
      'or portion of a certified irrigated tract within the DAU.\n\n'
  });

  docDefinition.content.push({
    text:
      'Please note that the landowner(s) of any certified irrigated tract must notify the North Platte NRD within 60 ' +
      'days of (1) a change in ownership of a certified irrigated tract or portion of a tract, or (2) the ' +
      'enrollment of a certified irrigated tract or portion of a tract in a program (e.g., EQIP) requiring the ' +
      'cessation of irrigation, or be subject to penalties.\n\n',
    bold: true
  });

  docDefinition.content.push({
    text:
      'The new allocation period began on October 1, 2014 and ends on September 30, 2019.\n\n',
    bold: true
  });

  docDefinition.content.push(
    'You will be receiving additional Water Year 2018 water use reports if you ' +
      'have other certifications, designated allocation units and/or pre-existing allocation units.\n\n' +
      'If you have a flow meter that has failed to record the total amount of water ' +
      'pumped, someone from the District will be contacting you in the near future to obtain the information ' +
      'necessary to calculate your Water Year 2018 water use. You will receive a Water Year 2018 water use ' +
      'report when the calculation is completed.\n\n' +
      'Visit our website at ' +
      'http://www.npnrd.org/water-management/soil-and-water-regulations/flow-meters.html to find information' +
      ' on how to read flow meters, calculate ground water use from the meter reading, and for the full text ' +
      'of the North Platte NRD Rules and Regulations for the Enforcement of the Nebraska Ground Water ' +
      'Management and Protection Act.\n\n' +
      'If any of the owner or tract information shown in this report is incorrect,' +
      ' or if you have any questions regarding the information contained in the report, please contact the NRD ' +
      'office at (308) 632-2749.'
  );

  // Build Tract Information
  let tractInfo = `DAU No: ${data.DAU_ID}\n`;
  let allocation = 0;
  if (data.Certs !== undefined || data.Certs !== null) {
    if (data.Certs[0].Water_Sources !== 'Ground Water Only') {
      // console.log(
      //   `${data.Certs[0].Water_Sources} evaluated as ${data.Certs[0]
      //     .Water_Sources !== 'Ground Water Only'}!`
      // );
      tractInfo += `Surface Water: ${data.Certs[0].Water_Sources}\n`;
    } else {
      tractInfo += 'Ground Water Only\n';
    }
  } else {
    tractInfo += 'Ground Water Only\n';
  }
  tractInfo += `GWMA: ${data.Certs[0].GWMA}\n\n`;

  let allocInfo = '';
  let d;
  let ed;
  // allocation information loop through Alloc_Period_Info
  data.Alloc_Period_Info.map(info => {
    if (info.e_date > moment('2018-09-29')) {
      // found the Allocation Period
      d = info.s_date;
      ed = info.e_date;
      allocInfo += `Allocation Period: ${moment(info.s_date).format(
        'MMMM D, YYYY'
      )} to ${moment(info.e_date).format('MMMM D, YYYY')}\n`;
      allocation += Math.round((info.Alloc_Acin + info.cf_od) * 10) / 10;
      allocInfo += `Allocated Inches: ${allocation} inches`;
    }
  });

  let certAcres = 0;
  let retiredAcres = 0;
  let exemtionAcres = 0;
  let saAcres = 0;
  let cert_info = [];

  // loop through Certs for totals of acres
  data.Certs.map(cert => {
    if (cert.Retirement !== undefined) {
      cert.Retirement.map(retire => {
        if (retire.e_WYear > 2017) {
          retiredAcres += math.round(retire.Acres, 2);
          // retiredAcres += Math.round(retire.Acres * 10) / 10;
        }
      });
    }

    // Exemptions Here!
    if (cert.Exemptions !== undefined) {
      cert.Exemptions.map(exempt => {
        if (exempt.Active === true) {
          exemtionAcres += math.round(exempt.Acres, 2);
          // exemtionAcres += Math.round(exempt.Acres * 10) / 10;
          saAcres += math.round(exempt.Acres, 2);
          // saAcres += Math.round(exempt.SA.Acres * 10) / 10;
        }
      });
    }

    if (cert.Cert_Details !== undefined) {
      // certAcres = math.round(100.2345, 2);
      certAcres += cert.Cert_Details.acres;
    }

    certAcres = math.round(certAcres, 2);

    cert_info.push({
      County: cert.County,
      Cert_ID: cert.Cert_ID,
      Alias: cert.Alias,
      legal: cert.Legal,
      ents: cert.Entities
    });
  });

  // Build Acres information
  let acreInfo = `Certified Acres: ${certAcres}\n`;
  acreInfo += `Retired: ${retiredAcres}\n`;
  acreInfo += `Exemption Acres: ${exemtionAcres}\n`;
  acreInfo += `1/15th Set Aside Acres: ${saAcres}\n`;
  const irrAcres = math.round(certAcres - retiredAcres - saAcres, 2);
  acreInfo += `Irrigable Acres: ${certAcres - retiredAcres - saAcres}\n\n`; // fix this

  docDefinition.content.push({
    text: '\n',
    margin: [0, 20],
    pageBreak: 'before'
  });

  docDefinition.content.push({
    columns: [
      {
        text: [
          {
            text: 'TRACT INFORMATION\n',
            decoration: 'underline',
            bold: true
          },
          tractInfo,
          {
            text: 'ALLOCATION INFORMATION\n',
            decoration: 'underline',
            bold: true
          },
          allocInfo
        ]
      },
      {
        text: [
          { text: 'ACRE INFORMATION\n', decoration: 'underline', bold: true },
          acreInfo
        ]
      }
    ]
  });

  docDefinition.content.push('\n');

  // Build cert information
  cert_info.map(cert => {
    let landowner_id;
    cert.ents.map(ent => {
      // find landowner and add name
      if (ent.Own_Type === 'Landowner') {
        // save the id
        landowner_id = String(ent.Id);
      }
    });

    let name = '';

    lo.map(owner => {
      if (landowner_id === String(owner.Id)) {
        // Found the owner, get the name
        if (owner.LName === null) {
          // no last name, use company
          name = owner.Company;
        } else if (owner.Company !== null) {
          // both Lname and Company, use company
          name = owner.Company;
        } else {
          // no company, use FName + LName
          name = `${owner.FName} ${owner.LName}`;
        }
      }
    });

    docDefinition.content.push({
      text: [
        { text: 'Landowner:  ', bold: true },
        name,
        { text: '      County:  ', bold: true },
        cert.County,
        '\n',
        { text: 'Certification Number:  ', bold: true },
        cert.Cert_ID,
        { text: '      Field Name:  ', bold: true },
        cert.Alias,
        { text: '      Legal Description:  ', bold: true },
        cert.legal,
        '\n\n'
      ]
    });
  });

  docDefinition.content.push({
    text: '\nWY 2018 Flow Meter(s) Reading',
    style: 'subheader',
    pageBreak: 'before'
  });

  // console.log(data);

  // Build Flow meter Lines
  // Loop through the flowmeters if more then one
  let fms_data = [];
  fms_data.push([
    { text: 'Flow Meter Serial Number', style: 'tableHeader' },
    { text: 'Fall 2018 Reading', style: 'tableHeader' },
    { text: 'Fall 2017 Reading', style: 'tableHeader' },
    { text: 'Date Meter Read', style: 'tableHeader' },
    {
      text: 'Ground Water Measured by Flow Meter',
      style: 'tableHeader'
    }
  ]);

  let y = [];

  y[2018] = 0; // current use
  y[2015] = 0;
  y[2016] = 0;
  y[2017] = 0;
  let all_meters_maint = [];

  data.FM.map(flowmeter => {
    // Each Flow meter
    // console.log(`Inside Flowmeter ${flowmeter}`);

    if (flowmeter.Active === true) {
      let fm_maint = [];
      fm_maint.push({
        text: `Meter Serial Number: ${flowmeter.Meter_Details.Serial_num}`
      });
      fm_maint.push({
        text: `Type of Meter: ${flowmeter.Meter_Details.Manufacturer}`
      });
      fm_maint.push({ text: `Units: ${flowmeter.Meter_Details.units}` });
      fm_maint.push({ text: `Factor: ${flowmeter.Meter_Details.factor}` });
      all_meters_maint.push(fm_maint);
    }

    let fm = [];
    fm.push({
      text: flowmeter.Meter_Details.Serial_num
        ? flowmeter.Meter_Details.Serial_num
        : '',
      alignment: 'center'
    });

    let prevReading = { text: '', alignment: 'center' };
    let currReading = { text: '', alignment: 'center' };
    let readDate = { text: '', alignment: 'center' };

    if (flowmeter.Meter_Readings !== undefined) {
      flowmeter.Meter_Readings.map(reading => {
        // console.log('Inside reading: ', reading);
        switch (reading.Water_Year) {
          case 2017:
            prevReading.text = reading.Reading;
            break;
          case 2018:
            currReading.text = reading.Reading;
            readDate.text = moment(reading.Date).format('MMMM D, YYYY');
            break;
        }
      });
    }

    fm.push(currReading);
    fm.push(prevReading);
    fm.push(readDate);

    let currUse = { text: '', alignment: 'center' };

    if (flowmeter.Usage !== undefined) {
      flowmeter.Usage.map(use => {
        // console.log('Inside Usage: ', use);
        switch (use.Water_Year) {
          case 2018:
            currUse.text = use.Use_ai.toFixed(1);
            y[2018] += use.Use_ai;
            break;
          case 2017:
            y[2017] += use.Use_ai;
            break;
          case 2016:
            y[2016] += use.Use_ai;
            break;
          case 2015:
            y[2015] += use.Use_ai;
            break;
        }
      });
    }

    fm.push(currUse);
    // console.log(fm);
    if (flowmeter.Active === true) {
      fms_data.push(fm);
    }
  });

  // console.log(y2018);
  // Add total line for use
  fms_data.push([
    {
      text: 'Total Ground Water Measured by Flow Meter(s):',
      colSpan: 4,
      alignment: 'right',
      bold: true
    },
    {},
    {},
    {},
    { text: `Use: ${y[2018].toFixed(1)}`, alignment: 'center' }
  ]);

  // console.log(fms_data);
  let tabledef = {
    style: 'tableExample',
    table: {
      headerRows: 1
    }
  };

  tabledef.table.body = fms_data;
  // console.log(tabledef);

  docDefinition.content.push(tabledef);

  // Water Usage Report

  docDefinition.content.push({
    text: 'Water Usage Report',
    style: 'header'
  });

  // console.log(data);
  // console.log(`allocation = ${allocation}, y2015 = ${y2015}, y2016 = ${y2016}, y2017 = ${y2017}, y2018 = ${y2018}`);
  // console.log(`acres = ${data.Cert_Details.acres}`);

  let al_edate = moment('2019-09-30');

  // build header array for table first
  const header1 = {
    text: `WY ${moment(d)
      .add(1, 'y')
      .format('YYYY')} - ${moment(al_edate).format('YYYY')} Available Water`,
    style: 'tableHeader'
  };

  let headerText = [];
  headerText.push(header1);
  let tableL1 = [];
  tableL1.push({
    text: `${math.round(allocation, 1)}`,
    alignment: 'center'
  });

  for (i = d.getFullYear() + 1; i < 2019; i++) {
    headerText.push({ text: `WY ${i} Water Used`, style: 'tableHeader' });
    tableL1.push({
      text: (math.round(y[i], 1) / irrAcres).toFixed(1),
      alignment: 'center'
    });
  }

  let tableBody = [];
  tableBody.push(headerText);
  tableBody.push(tableL1);

  let table2def = {
    style: 'tableExample',
    table: {
      headerRows: 1,
      body: tableBody
    }
  };

  docDefinition.content.push(table2def);
  docDefinition.content.push({
    text:
      'All values in Acre-Inches per Acre, All values rounded to the nearest tenth',
    style: 'tableFooter'
  });

  docDefinition.content.push({
    text: 'WY = Water Year (October 1st through September 30th)',
    style: 'tableFooter'
  });

  let waterUsage = 0;

  for (i = d.getFullYear() + 1; i < 2019; i++) {
    waterUsage += math.round(math.round(y[i], 1) / irrAcres, 1);
  }

  docDefinition.content.push({
    text: `\nWY 2019 Available Water (Acre-Inches per Acre): ${(
      math.round(allocation, 1) - waterUsage
    ).toFixed(1)}`,
    style: 'emphasis',
    bold: true
  });

  docDefinition.content.push({
    text:
      'If you have any questions related to this report, please contact the North Platte NRD office in Scottsbluff at (308) 632-2749.',
    italics: true
  });

  docDefinition.content.push({
    text: '\nMeter Maintenance Information',
    style: 'subheader',
    margin: [0, 20],
    pageBreak: 'before'
  });

  docDefinition.content.push({
    text:
      'Meter maintenance is the responsibility of the Landowner. However, you have opted for the following flow meters to be included in the NPNRD meter maintenance program.\n\n'
  });

  docDefinition.content.push({
    style: 'tableExample',
    table: {
      widths: [200, 200, '*', '*'],
      body: all_meters_maint
    },
    layout: 'noBorders'
  });

  const fonts = {
    Roboto: {
      normal: path.join(__dirname, '../../', '/fonts/Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../../', '/fonts/Roboto-Medium.ttf'),
      italics: path.join(__dirname, '../../', '/fonts/Roboto-Italic.ttf'),
      bolditalics: path.join(
        __dirname,
        '../../',
        '/fonts/Roboto-MediumItalic.ttf'
      )
    }
  };

  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Build file path
  const fullfilePath = path.join(
    __dirname,
    '../../',
    '/public/pdffiles/',
    `${data.DAU_ID}.pdf`
  );

  pdfDoc.pipe(fs.createWriteStream(fullfilePath));
  pdfDoc.end();
};

const addressMake = (Entity, mt = false) => {
  // mt = true adds "Mail To "

  let content = [];
  // console.log(Entity);
  if (Entity.prev === false) {
    // is a current owner, add to mail to

    // build name
    if (Entity.Company === null) {
      // First and Last Name
      content.push(
        `${mt ? 'Mail To ' : ''}${Entity.Own_Type}: \n ${Entity.FName} ${
          Entity.LName
        }\n`
      );
    } else {
      // Company and then first and last name

      if (Entity.LName != null) {
        // Add name under company
        content.push(
          `${mt ? 'Mail To ' : ''}${Entity.Own_Type}: \n ${Entity.Company} \n ${
            Entity.FName
          } ${Entity.LName}\n`
        );
      } else {
        // No Name under company
        content.push(
          `${mt ? 'Mail To ' : ''}${Entity.Own_Type}: \n ${Entity.Company}\n`
        );
      }
    }

    // address
    if (Entity.Address2 === null) {
      // single line address
      content.push(`${Entity.Address}\n`);
      content.push(`${Entity.City}, ${Entity.State}  ${Entity.ZipCode}\n\n`);
    } else {
      // two line address
      content.push(`${Entity.Address}\n`);
      content.push(`${Entity.Address2}\n`);
      content.push(`${Entity.City}, ${Entity.State}  ${Entity.ZipCode}\n\n`);
    }
  }
  return content;
};

module.exports = DauProcess;
