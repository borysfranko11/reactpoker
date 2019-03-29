// Load Certs Model
const Certs = require('../models/Certs');
const Dau_Pau_Certs = require('../models/dau_pau_certs');

const createDauPaus = () => {
  Dau_Pau_Certs.deleteMany({}).then(() => {
    Certs.aggregate([
      {
        $lookup: {
          from: 'dau',
          localField: '_id',
          foreignField: 'Assoc_Certs',
          as: 'dau_memb'
        }
      },
      {
        $match: {
          dau_memb: {
            $exists: true,
            $not: {
              $size: 0
            }
          },
          'dau_memb.Alloc_Period_Info.e_date': {
            $gte: new Date('Mon, 01 Jan 2018 00:00:00 GMT')
          }
        }
      },
      {
        $project: {
          _id: 0,
          cert_ids: '$_id'
        }
      }
    ])
      .then(ids => {
        // console.log(ids);
        ids.map(id => {
          // console.log(id.cert_ids);
          Dau_Pau_Certs.create({ cert_ids: id.cert_ids }).then(done => {});
        });
      })
      .then(() => {
        Certs.aggregate([
          {
            $lookup: {
              from: 'pau',
              localField: '_id',
              foreignField: 'Assoc_Certs',
              as: 'pau_memb'
            }
          },
          {
            $match: {
              pau_memb: {
                $exists: true,
                $not: {
                  $size: 0
                }
              },
              'pau_memb.Alloc_Period_Info.e_date': {
                $gte: new Date('Mon, 01 Jan 2018 00:00:00 GMT')
              }
            }
          },
          {
            $project: {
              _id: 0,
              cert_ids: '$_id'
            }
          }
        ]).then(ids => {
          ids.map(id => {
            Dau_Pau_Certs.create({ cert_ids: id.cert_ids }).then(() => {});
          });
        });
      });
  });
};

module.exports = createDauPaus;
