const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../controllers/authController');

router.get('/', eventController.getEvents);
router.post('/', auth.verifyToken,eventController.createEvent);
router.put('/:id', auth.verifyToken,eventController.updateEvent);
router.patch('/:id', auth.verifyToken,eventController.partialUpdateEvent);
router.delete('/:id', auth.verifyToken,eventController.deleteEvent);

module.exports = router;
