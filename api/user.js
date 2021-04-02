const express = require('express');
const { userGenerate } = require('../services/databaseService.mjs');
const { postUserFull } = require('../services/databaseService.mjs');
const { getUser } = require('../services/databaseService.mjs');
const router = express.Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

// import all functions for database
const db = require('../services/databaseService.mjs');

router.post('/generate', jsonParser, userGenerate);

router.post('/', jsonParser, postUserFull);

router.get('/:id', getUser);

module.exports = router;