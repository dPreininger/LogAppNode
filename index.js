const express = require('express');
const server = express();
const path = require('path');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const port = 8080;
const { getLastLog } = require('./services/databaseService.mjs');
const { postLog } = require('./services/databaseService.mjs');

// routes
const apiRouter = require("./api/apiRoutes");

server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');

server.use(express.static(path.join(__dirname, 'static')));

server.use(cookieParser());

server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.render('domov');
})

server.get('/prijava', (req, res) => {
    res.render('prijava');
})

server.get('/dodaj/:locationId', (req, res) => {
    if(req.cookies.UserId) {
        let userId = req.cookies.UserId;
        getLastLog(userId, req.params.locationId, function(err, result) {
            console.log(result);
            if(result.length === 0 || result[0].idLogType != 0) {
                let d = new Date();
                d.setTime(d.getTime())
                logObj = {
                    idUsers: userId,
                    idLocations: req.params.locationId,
                    idLogType: 0,
                    logTime: d
                }

                postLog(logObj);
                // porihtaj, da view pise prihod in pohandlaj view

            } else {
                res.cookie('LocationId', req.params.locationId);
                console.log('redirect na odhod');
                // pohendlaj
            }
            res.send('ok');
        })
    } else {
        res.cookie('LocationId', req.params.locationId);
        res.redirect('/prijava');
    }
})

// start server
server.listen(port, () => {
    console.log(`Server opened at http://localhost:${port}`);
  })