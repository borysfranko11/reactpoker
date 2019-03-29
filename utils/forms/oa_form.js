const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const createOAReport = data => {
  console.log('PC or OA Cert ', data.Cert_ID);
  // console.log(data);
  if (data.Cert_ID === '3114') {
    console.log(data);
  }
  // const fullfilePath = path.resolve(
  //   __dirname,
  //   '../../public/pdffiles/example.pdf'
  // );

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
            'Water Year 2018 Ground Water Use and Water Year 2019 Ground Water Availability',
          alignment: 'right'
        }
      ],
      style: 'pageHeader'
    },
    footer: {
      columns: [
        `Cert No: ${data.Cert_ID}`,
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
        fontSize: 14,
        bold: true,
        // margin: [left, top, right, bottom]
        margin: [30, 20, 30, 0]
      },
      pageFooter: {
        fontSize: 10,
        margin: [30, 5, 30, 5]
      },
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      emphasis: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
        decoration: 'underline'
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      },
      tableFooter: {
        fontSize: 9
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };

  let landowner = ['Landowner:'];
  // Create Mail to:
  data.Entities.map(Entity => {
    // console.log(Entity);
    if (Entity.prev === false) {
      // is a current owner, add to mail to

      // build name
      if (Entity.Company === null) {
        // First and Last Name
        docDefinition.content.push(
          `\n\n\n\nMail To ${Entity.Own_Type}: \n ${Entity.FName} ${
            Entity.LName
          }`
        );
        if (Entity.Own_Type === 'Landowner') {
          landowner.push(`${Entity.FName} ${Entity.LName}`);
        }
      } else {
        // Company and then first and last name

        if (Entity.LName != null) {
          // Add name under company
          docDefinition.content.push(
            `\n\n\n\nMail To ${Entity.Own_Type}: \n ${Entity.Company} \n ${
              Entity.FName
            } ${Entity.LName}`
          );
          if (Entity.Own_Type === 'Landowner') {
            landowner.push(
              `${Entity.Company} \n ${Entity.FName} ${Entity.LName}`
            );
          }
        } else {
          // No Name under company
          docDefinition.content.push(
            `\n\n\n\nMail To ${Entity.Own_Type}: \n ${Entity.Company}`
          );
          if (Entity.Own_Type === 'Landowner') {
            landowner.push(`${Entity.Company}`);
          }
        }
      }

      // address
      if (Entity.Address2 === null) {
        // single line address
        docDefinition.content.push(`${Entity.Address}`);
        docDefinition.content.push(
          `${Entity.City}, ${Entity.State}  ${Entity.ZipCode}\n\n`
        );
        if (Entity.Own_Type === 'Landowner') {
          landowner.push(`${Entity.Address}`);
          landowner.push(`${Entity.City}, ${Entity.State}  ${Entity.ZipCode}`);
        }
      } else {
        // two line address
        docDefinition.content.push(`${Entity.Address}`);
        docDefinition.content.push(`${Entity.Address2}`);
        docDefinition.content.push(
          `${Entity.City}, ${Entity.State}  ${Entity.ZipCode}\n\n`
        );
        if (Entity.Own_Type === 'Landowner') {
          landowner.push(`${Entity.Address}`);
          landowner.push(`${Entity.Address2}`);
          landowner.push(`${Entity.City}, ${Entity.State}  ${Entity.ZipCode}`);
        }
      }
    }
  });

  docDefinition.content.push({ text: '\n\n', pageBreak: 'before' });
  docDefinition.content.push(landowner);

  docDefinition.content.push({
    text:
      `\n\n\nRE: Water Year 2018 Ground Water Use and Water Years 2019 Available Water Report for a ` +
      'Certified Irrigated Tract \n\n' +
      'For your convenience, the enclosed form(s) show the Water Year 2018 ground water use and the available ' +
      'water remaining in the current allocation period on the certified irrigated tract identified by the ' +
      'certification number, legal description(s) and, if applicable, the field name of that certification.' +
      ' The certification number has been assigned to that tract by the North Platte NRD for administrative ' +
      'purposes. The field name is the name for that tract that you have provided to the District. \n\n'
  });

  docDefinition.content.push({
    text:
      'Please note that the landowner(s) of any certified irrigated tract must ' +
      'notify the North Platte NRD within 60 days of (1) a change in ownership of a certified irrigated tract ' +
      'or portion of a tract, or (2) the enrollment of a certified irrigated tract or portion of a tract in a ' +
      'program (e.g., EQIP) requiring the cessation of irrigation, or be subject to penalties.\n\n' +
      'The allocation period began October 1, 2014 and ends on September 30, 2019.\n\n',
    bold: true
  });

  docDefinition.content.push(
    'You will be receiving additional Water Year 2018 water use reports if you ' +
      'have other certifications, designated allocation units and/or pre-exisiting allocation units.\n\n' +
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

  let ownerString = '';
  // Get Owner
  data.Entities.map(Entity => {
    if (Entity.prev === false && Entity.Own_Type === 'Landowner') {
      // build name
      if (Entity.Company === null) {
        // First and Last Name
        ownerString = `${Entity.FName} ${Entity.LName}`;
      } else {
        // Company and then first and last name

        if (Entity.LName != null) {
          // Add name under company
          ownerString = `${Entity.Company}\n ${Entity.FName} ${Entity.LName}`;
        } else {
          // No Name under company
          ownerString = `${Entity.Company}`;
        }
      }

      // address
      if (Entity.Address2 === null) {
        // single line address
        ownerString += `\n${Entity.Address}\n ${Entity.City}, ${
          Entity.State
        }  ${Entity.ZipCode}\n\n`;
      } else {
        // two line address
        ownerString += `\n${Entity.Address}\n${Entity.Address2}\n${
          Entity.City
        }, ${Entity.State}  ${Entity.ZipCode}\n\n`;
      }
    }
  });

  // Build Tract Information
  let tractInfo = `Cert No: ${data.Cert_ID}\n`;
  tractInfo += `Field Name: ${data.Alias == null ? '' : data.Alias}\n`;
  tractInfo += `Legal Description: ${data.Legal}\n`;
  tractInfo += `${data.County}\n`;
  tractInfo += `GWMA: ${data.GWMA}\n`;

  if (data.Water_Sources != null) {
    tractInfo += `Surface Water: ${data.Water_Sources}\n`;
  }

  let retirement = 0;
  if (data.Retirement !== undefined) {
    data.Retirement.map(retire => {
      if (retire.e_WYear > 2017) {
        retirement += retire.Acres;
      }
    });
  }

  // Exemptions Here!
  let ex_ac = 0;
  let sa_ac = 0;

  data.Exemptions.map(exempt => {
    if (exempt.Active === true) {
      ex_ac += exempt.Acres;
      sa_ac += exempt.SA.Acres;
    }
  });

  // Build Acres information
  let acreInfo = `Certified Acres: ${data.Cert_Details.acres}\n`;
  acreInfo += `Retired: ${retirement}\n`;
  acreInfo += `Exemption Acres: ${ex_ac}\n`; // Fix this
  acreInfo += `1/15th Set Aside Acres: ${sa_ac}\n`; // fix this
  acreInfo += `Irrigable Acres: ${data.Cert_Details.acres -
    retirement -
    sa_ac}\n\n`; // fix this

  // Build Alloc Information
  let allocation = 0;
  let d = moment('2014-09-29');
  let al_edate = moment('2019-09-30');

  // allocations can end in the middle of the period, if they do, then just take the
  // beginning year and end year and fill the form like that.
  // Allocation in 3873 is an example.
  if (data.Allocations !== null) {
    if (data.Allocations.length > 0) {
      data.Allocations.map(alloc => {
        // find the latest allocation date
        if (alloc.s_date > d) {
          // if overdraft (cf_od < 0) it's multiplied by 2 as a penalty
          allocation =
            alloc.Allocation_Acin +
            (alloc.cf_od >= 0 ? alloc.cf_od : alloc.cf_od * 2);
          // now reset d to the s_date and let it map again.
          d = alloc.s_date;
          al_edate = alloc.e_date;
        }
      });
    }
  } else {
    allocation = -999;
  }
  let allocInfo = `Allocation Period: ${moment(d).format(
    'MMMM D, YYYY'
  )} to ${moment(al_edate).format('MMMM D, YYYY')}\n`;

  allocInfo += `Allocated Inches: ${Math.round(allocation * 10) / 10} inches\n`;

  docDefinition.content.push({
    text: '\n',
    margin: [0, 20],
    pageBreak: 'before'
  });

  docDefinition.content.push({
    columns: [
      {
        text: [
          { text: 'OWNER\n', decoration: 'underline', bold: true },
          ownerString,
          {
            text: 'TRACT INFORMATION\n',
            decoration: 'underline',
            bold: true
          },
          tractInfo
        ]
      },
      {
        text: [
          { text: 'ACRE INFORMATION\n', decoration: 'underline', bold: true },
          acreInfo,
          {
            text: 'ALLOCATION INFORMATION\n',
            decoration: 'underline',
            bold: true
          },
          allocInfo
        ]
      }
    ]
  });

  docDefinition.content.push({
    text: '\n\nWY 2018 Flow Meter(s) Reading',
    style: 'header',
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

  data.Flowmeters.map(flowmeter => {
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
    text: `${Math.round(allocation * 10) / 10}`,
    alignment: 'center'
  });

  for (i = d.getFullYear() + 1; i < 2019; i++) {
    headerText.push({ text: `WY ${i} Water Used`, style: 'tableHeader' });
    tableL1.push({
      text: (Math.round(y[i] * 10) / 10 / data.Cert_Details.acres).toFixed(1),
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
    waterUsage +=
      Math.round((Math.round(y[i] * 10) / 10 / data.Cert_Details.acres) * 10) /
      10;
  }

  docDefinition.content.push({
    text: `\nWY 2019 Available Water (Acre-Inches per Acre): ${(
      Math.round(allocation * 10) / 10 -
      waterUsage
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
    style: 'subheader'
  });

  // docDefinition.content.push({
  //   text:
  //     'Meter maintenance is the responsibility of the Landowner. However, you have opted for the following flow meters to be included in the NPNRD meter maintenance program.\n\n'
  // });

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
    `${data.Cert_ID}.pdf`
  );

  pdfDoc.pipe(fs.createWriteStream(fullfilePath));
  pdfDoc.end();
};

module.exports = createOAReport;
