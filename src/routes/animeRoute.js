const express = require('express');
const router = express.Router({ mergeParams: true });

const animeController = require('../controllers/animeController')


router.route('/')
    .get(animeController.getAnimes)
router.route('/:id')
    .get(animeController.getAnimeByid)
router.route('/')
    .post(animeController.createAnime)
router.route('/:id')
    .put(animeController.updateAnime)
router.route('/:id')
    .delete(animeController.deleteAnime)
module.exports = router;