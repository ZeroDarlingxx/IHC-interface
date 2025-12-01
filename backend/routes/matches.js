const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');


router.get('/tournaments/:torneioId/matches', matchController.getByTournament);

router.get('/:id', matchController.getById);


router.post('/', matchController.create);

router.post('/:id/score', matchController.updateScore);

router.delete('/:id', matchController.delete);

module.exports = router;
