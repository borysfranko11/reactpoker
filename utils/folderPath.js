const fse = require('fs-extra');

const ensurePath = dir => {
  // With a callback:
  fse.ensureDir(dir, err => {
    // console.log(err); // => null
    // dir has now been created, including the directory it is to be placed in
  });
};

module.exports = ensurePath;
