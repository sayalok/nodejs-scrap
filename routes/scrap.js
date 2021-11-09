const express = require('express');

const scrapController = require('../controllers/scrap');

const router = express.Router();

router.get('/trucklist/:page?', scrapController.addItems);

module.exports = router;