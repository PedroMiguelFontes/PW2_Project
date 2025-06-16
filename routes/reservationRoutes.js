const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getReservations);
router.post('/', reservationController.createReservation);
/*router.put('/:id', reservationController.updateReservation);
router.patch('/:id', reservationController.partialUpdateReservation);
router.delete('/:id', reservationController.deleteReservation);*/

module.exports = router;
