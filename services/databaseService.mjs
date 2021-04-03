const mysql = require('mysql');


const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'david',
  password: '1234',
  database: 'logiranje'
});

con.connect(function(err) {
  if(err) throw err;
  console.log('Connected to MySql server!');
});

const generateRandomNumber = () => {
  let prva = Math.floor(Math.random() * 8);
  prva++;
  prva *= 100000;
  let ostalo = Math.floor(Math.random() * 99999);
  
  id = prva + ostalo;
  return id;
}

const userGenerate = (req, res) => {
  let id = generateRandomNumber();
    let query = 'SELECT * FROM users WHERE idUsers = ?;';
    con.query(query, [id], (err, result) => {
      if(err) throw err;
      else {
        if(result.length == 0) {
          postUser(req, res, id);
        } else {
          userGenerate(req, res);
        }
      }
    })
}

const postUser = (req, res, id) => {
  let query = 'INSERT INTO users (idUsers, name, lastName)' +
    'VALUES (?, ?, ?);';
  con.query(query, [id, req.body.name, req.body.lastName], (err, result) => {
    if(err) throw err;
    else {
      let data = {
        idUsers: id,
        name: req.body.name,
        lastName: req.body.lastName
      }
      res.json(data);
    }
  })
}

const getUser = (req, res) => {
  let query = 'SELECT * FROM users WHERE idUsers = ?';
  con.query(query, [req.params.id], (err, result) => {
    if(err) throw err;
    else {
      if(result.length == 0) {
        res.send();
      }
      else {
        res.send(result[0]);
      }
    }
  })
}

const postUserFull = (req, res) => {
  let query = 'INSERT INTO users (idUsers, name, lastName) ' +
    'VALUES (?, ?, ?)';

  con.query(query, [req.body.idUsers, req.body.name, req.body.lastName], (err, result) => {
    if(err) throw err;
    else res.send('OK!');
  })
}

const getLastLog = (userId, locationId, callback) => {
  let query = 'SELECT * FROM logs WHERE idUsers = ? AND idLocations = ? ORDER BY logTime DESC LIMIT 1;';

  con.query(query, [userId, locationId], (err, result) => {
    if(err) throw err;
    callback(err, result);
  })
}

const postLog = (obj) => {
  let query = 'INSERT INTO logs (idLocations, idUsers, logTime, idLogType) ' +
    'VALUES (?, ?, ?, ?)';

  con.query(query, [obj.idLocations, obj.idUsers, obj.logTime, obj.idLogType]);
}

module.exports = {
  userGenerate: userGenerate,
  postUserFull: postUserFull,
  getUser: getUser,
  getLastLog: getLastLog,
  postLog: postLog
};