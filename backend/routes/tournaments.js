const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.get('/', tournamentController.getAll);
router.post('/', tournamentController.create);
router.get('/:id', tournamentController.getById);

module.exports = router;