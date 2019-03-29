const mongoose = require('mongoose');
const Flowmeters = require('../models/Flowmeters');

const flowmeterCalc = (data, yr) => {
  if (data[0].Meter_Readings === null || data[0].Meter_Readings === undefined) {
    // No readings, Don't do anything
  } else {
    // First array item is the Latest Year.
    // console.log(data[0].Meter_Readings.Reading);

    const curReading = data[0];

    // check to see if there is a usage for the current year already manual calculated
    Flowmeters.find({
      FM_ID: curReading.FM_ID,
      'Usage.Water_Year': curReading.Meter_Readings.Water_Year
    }).then(thecount => {
      // console.log(thecount);
      if (thecount.length === 0) {
        // No precalced useage, calculate
        if (data[1] != null) {
          // Check to ensure there is a reading here for the previous year
          const diff = processReading(data);

          // save new reading
          saveReading(
            curReading.FM_ID,
            curReading.Meter_Readings.Water_Year,
            diff
          );

          // Unusally High Readings
          if (diff > 6000) {
            outlier(curReading.FM_ID, yr, 1);
          }

          // console.log(`Final difference saved is ${diffReading}`);
        } else {
          // no second year of readings;

          // Check to see install date, if install is the second year of readings use it
          if (data[0].Install !== undefined) {
            if (
              data[0].Install.Date >=
              new Date(data[0].Meter_Readings.Water_Year - 1, 9, 30)
            ) {
              // use install reading as beginning meter reading for that year
              const diff = processReading(data, 1);
              saveReading(
                curReading.FM_ID,
                curReading.Meter_Readings.Water_Year,
                diff
              );
            } else {
              Flowmeters.findOne(
                { FM_ID: data[0].FM_ID },
                { 'Install.Date': 1 }
              ).then(fm => {
                if (fm.Install.Date === undefined) {
                  // create outlier for previous reading missing
                  outlier(curReading.FM_ID, yr, 2);
                } else {
                  if (fm.Install.Date.getFullYear() <= yr - 1) {
                    // create outlier for previous reading missing
                    outlier(curReading.FM_ID, yr, 2);
                  } else {
                    // Meter was installed after year, don't push a outlier
                    // console.log('skipped for install year');
                  }
                }
              });
            }
          } else {
            outlier(curReading.FM_ID, yr, 2);
          }
        }
      }
    });
  }
};

const processReading = (rData, inst = 0) => {
  const curReading = rData[0];
  let prevReading = 0;

  // if there is no previous reading and need to use install reading
  if (inst === 0) {
    prevReading = rData[1].Meter_Readings.Reading;
  } else {
    prevReading = curReading.Install.Reading;
  }

  // Subtract first meter from last meter, convert to acre-inches
  let diffReading = curReading.Meter_Readings.Reading - prevReading;

  // console.log(`First Subtract ${diffReading}`);

  // Check for positive value, if negative, use rollover value
  if (diffReading < 0) {
    // must be rollover
    diffReading =
      curReading.Meter_Readings.Reading +
      curReading.Meter_Details.roll_over_val -
      prevReading;
    // console.log(`The rollover difference ${diffReading}`);
  }

  // This should convert it to the correct decimal places
  diffReading = diffReading * curReading.Meter_Details.factor;

  // Sets usage to Acre Inches from three types of units: Acre Inches, Acre Feet, Gallons
  switch (curReading.Meter_Details.units) {
    case 'Acre Feet':
      // Correct for Acre-Feet
      diffReading = diffReading * 12;
      break;
    case 'Gallons':
      // Correct for Gallons
      diffReading = diffReading / 27154.25;
      break;
    default: // is already in Acre Inches
  }

  return diffReading;
};

const saveReading = (fmid, wy, read) => {
  // Save acre inches value to database within meter under Usage array of object
  Flowmeters.updateOne(
    { FM_ID: fmid },
    {
      $push: {
        Usage: {
          Water_Year: wy,
          Use_ai: read,
          Man_Calc: false
        }
      }
    }
  )
    .then(update => {
      // must have the then to commit otherwise can force with .exec()
      // just to see what it did update
      // console.log(JSON.stringify(update));
    })
    .catch(error => console.log(error, `The FM_ID is: ${curReading.FM_ID}`));
};

const outlier = (fmid, wy, nt) => {
  // creates outlier for meter reading
  let note = '';

  switch (nt) {
    case 1:
      //unusually high reading
      note = `Reading during ${wy} water year is unusually high.`;
      break;
    case 2:
      // no prevYear reading
      note = `No ${wy - 1} Reading Available`;
      break;
    default:
      // not sure
      note = `An unknown error occurred for ${wy} water year.`;
      break;
  }

  Flowmeters.updateOne(
    { FM_ID: fmid },
    {
      $set: { Active_Outlier: true },
      $push: {
        Outliers: {
          Date: Date.now(),
          Water_Year: wy,
          Res_Date: null,
          Created_By: 'Automated',
          Note: note,
          Res_Note: null
        }
      }
    }
  ).then(update => {
    // console.log(`Outlier Created for ${data[0].FM_ID}.`);
  });
};

module.exports = flowmeterCalc;
