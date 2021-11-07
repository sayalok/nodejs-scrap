const express = require('express');

const scrapController = require('../controllers/scrap');

const router = express.Router();

router.get('/trucklist', scrapController.addItems);
router.post('/singleTruckDetails', scrapController.getSingleDetails);

module.exports = router;