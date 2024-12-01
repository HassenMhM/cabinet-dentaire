const express = require('express');
const { getAllEvents, getEventById, addEvent, updateEvent, deleteEvent } = require('../controllers/eventsControllers');
const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', addEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
