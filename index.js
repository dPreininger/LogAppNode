const express = require('express');
const server = express();
const path = require('path');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const port = 8080;
const secret = 'secret1234';

const { getLastLog } = require('./services/databaseService.mjs');
const { postLog } = require('./services/databaseService.mjs');

// routes
const apiRouter = require("./api/apiRoutes");

server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');

server.use(express.static(path.join(__dirname, 'static')));
server.use(cookieParser());
server.use(session({secret: secret}));
server.use(flash());
server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.render('domov');
})

server.get('/prijava', (req, res) => {
    res.render('prijava');
})

server.get('/dodaj/:locationId', (req, res) => {
    let locationId = req.params.locationId;
    if(req.cookies.UserId) {
        let userId = req.cookies.UserId;
        getLastLog(userId, locationId, (err, result) => {
            if(result.length === 0 || result[0].idLogType != 0) {
                let d = new Date();
                d.setTime(d.getTime())
                logObj = {
                    idUsers: userId,
                    idLocations: locationId,
                    idLogType: 0,
                    logTime: d
                }

                postLog(logObj, (err, result) => {
                    if(err) throw err;
                    req.flash('tip', 'Prihod');
                    res.redirect('/uspeh');
                });

            } else {
                res.cookie('LocationId', locationId);
                res.redirect('/odhod');
            }
        })
    } else {
        res.cookie('LocationId', locationId);
        res.redirect('/prijava');
    }
})

server.get('/odhod', (req, res) => {
    if(req.cookies.UserId) {
        if(req.cookies.LocationId) {
            let userId = req.cookies.UserId;
            let locationId = req.cookies.LocationId;
            
            getLastLog(userId, locationId, function(err, result) {
                if(result.length === 0 || result[0].idLogType != 0) {
                    res.redirect('/dodaj/' + locationId);
                } else {
                    req.flash('tip', 'odhod');
                    res.render('odhod');
                }
            })

        } else {
            console.log('napaka - ni location id');
            res.redirect('/');
        }
    } else {
        res.redirect('/prijava');
    }
})

server.get('/uspeh', (req, res) => {
    /*
    HttpCookie hc = new HttpCookie("LocationId");
            hc.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Add(hc);

            string tip = (string)TempData["tip"];
            if (tip == null) return RedirectToAction("Index", "Domov");
            
            ViewBag.Tip = tip;

            // mogoce ni najboljse
            User user = DatabaseService.GetUsers(Int32.Parse(Request.Cookies["UserId"].Value))[0];
            ViewBag.Ime = user.Name;
            ViewBag.Priimek = user.LastName;
            ViewBag.Id = user.IdUsers;

            return View();

    */
    let flashData = req.flash('tip');

    if(flashData.length === 0) {
        res.redirect('/');
    } else {
        res.clearCookie('LocationId');
        res.send(flashData);
        // res.render()
    }

})

// start server
server.listen(port, () => {
    console.log(`Server opened at http://localhost:${port}`);
  })