const express = require('express');

const scrapController = require('../controllers/scrap');

const router = express.Router();

//web view
router.get('/advertisements', scrapController.getAllAdvertisementList);
router.get('/advertisements/:productId', scrapController.getSingleAdvertisement);

//api
router.get('/advertisement/:page?', scrapController.addItems);
router.get('/advertisementList/', scrapController.getAllAdvertisementApi);
router.get('/:productId',scrapController.advertisement_get_byidApi)


module.exports = router;