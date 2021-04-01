const express = require('express');
const server = express();
const path = require('path');
const exphbs  = require('express-handlebars');
const port = 8080;

server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');


server.get('/', (req, res) => {
    res.render('domov');
})


// start server
server.listen(port, () => {
    console.log(`Server opened at http://localhost:${port}`);
  })