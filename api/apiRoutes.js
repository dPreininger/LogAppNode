const express = require('express');
const router = express.Router();

// routes
const userRouter = require('./user.js');

router.use('/user', userRouter);

module.exports = router;