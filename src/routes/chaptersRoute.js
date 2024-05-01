const express = require('express');
const router = express.Router({ mergeParams: true });

const chapterController = require('../controllers/chapterController')


router.route('/')
    .get(chapterController.getChapters)
router.route('/:id')
    .get(chapterController.getChapterByid)
router.route('/')
    .post(chapterController.createChapter)
router.route('/:id')
    .put(chapterController.updateChapter)
router.route('/:id')
    .delete(chapterController.deleteChapter)
module.exports = router;