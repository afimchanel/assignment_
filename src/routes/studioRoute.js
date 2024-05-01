const express = require('express');
const router = express.Router({ mergeParams: true });

const studioController = require('../controllers/studioController')


router.route('/')
    .get(studioController.getStudios)
router.route('/:id')
    .get(studioController.getStudioByid)
router.route('/')
    .post(studioController.createStudio)
router.route('/:id')
    .put(studioController.updateStudio)
router.route('/:id')
    .delete(studioController.deleteStudio)
module.exports = router;