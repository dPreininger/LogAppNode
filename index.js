const express = require('express');
const server = express();
const path = require('path');
const exphbs  = require('express-handlebars');
const port = 8080;

// routes
const apiRouter = require("./api/apiRoutes");

server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');

server.use(express.static(path.join(__dirname, 'static')));

server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.render('domov', );
})


// start server
server.listen(port, () => {
    console.log(`Server opened at http://localhost:${port}`);
  })