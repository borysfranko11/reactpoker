const express = require('express');
const router = express.Router();
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Tournament = require('../../models/Tournament');

// @route   GET api/tour/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/tour/register
// @desc    Register Tour
// @access  Public
router.post('/register', (req, res) => {

    Tournament.findOne({tourid : req.body.tourid}).then(tour => {
        let newplayers = tour.players + 1;
        Tournament.findOneAndUpdate(
                    {tourid: req.body.tourid},
                    {$set: {players: newplayers}})
            .then(result => {
                Profile.findOne({user:req.body.userid}).then(profile => {
                    let currentgold = profile.gold - 100;
                    Profile.findOneAndUpdate(
                        {user: req.body.userid},
                        {$set: {gold: currentgold}})
                    .then (final => {
                        res.json('success');
                    });
                })
            })
    });
});

// @route   POST api/tour/unregister
// @desc    unRegister Tour
// @access  Public
router.post('/unregister', (req, res) => {

    Tournament.findOne({tourid : req.body.tourid}).then(tour => {
        let newplayers = tour.players - 1;
        Tournament.findOneAndUpdate(
                    {tourid: req.body.tourid},
                    {$set: {players: newplayers}})
            .then(result => {
                Profile.findOne({user:req.body.userid}).then(profile => {
                    let currentgold = profile.gold + 100;
                    Profile.findOneAndUpdate(
                        {user: req.body.userid},
                        {$set: {gold: currentgold}})
                    .then (final => {
                        res.json('success');
                    });
                })
            })
    });
});
// @route   POST api/tour/get/:id
// @desc    get Tour info by id
// @access  Public
router.get('/get/:id', (req, res) => {
    Tournament.findOne({tourid : 1}).then(tour => {
        res.json(tour);
    }).catch(err => res.status(404).json(err));;
});

module.exports = router;
