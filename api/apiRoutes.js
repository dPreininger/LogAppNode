const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {postLog} = require('../services/databaseService.mjs');

const formParser = bodyParser.urlencoded();

// routes
const userRouter = require('./user.js');

router.use('/user', userRouter);

router.post('/log', formParser, (req, res) => {
    let userId = req.body.idUsers;
    let locationId = req.body.idLocations;
    let idLogType = req.body.idLogType;
    let d = new Date()
    d.setTime(d.getTime());
    let obj = {
        idLocations: locationId,
        idUsers: userId,
        idLogType: idLogType,
        logTime: d
    }

    postLog(obj, (err, result) => {
        if(err) throw err;
        res.send('ok');
    });

})

module.exports = router;