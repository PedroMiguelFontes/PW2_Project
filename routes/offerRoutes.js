const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const auth = require('../controllers/authController');


router.get('/', offerController.getOffers);
router.post('/', auth.verifyToken,offerController.createOffer);
router.put('/:id', auth.verifyToken,offerController.updateOffer);
router.patch('/:id', auth.verifyToken,offerController.partialUpdateOffer);   
router.delete('/:id', auth.verifyToken,offerController.deleteOffer);

module.exports = router;
