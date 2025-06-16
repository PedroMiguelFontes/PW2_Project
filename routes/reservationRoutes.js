const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../controllers/authController');

router.get('/', reservationController.getReservations);
router.post('/', auth.verifyToken,reservationController.createReservation);
router.put('/:id', auth.verifyToken,reservationController.updateReservation);
router.patch('/:id', auth.verifyToken,reservationController.partialUpdateReservation);
router.delete('/:id', auth.verifyToken,reservationController.deleteReservation);

module.exports = router;
