const express = require('express');
const router = express.Router({ mergeParams: true });

const userController = require('../controllers/userController')


router.route('/')
    .get(userController.getUsers)
router.route('/:id')
    .get(userController.getUserByid)
router.route('/')
    .post(userController.createUser)
router.route('/:id')
    .delete(userController.deleteUser)
module.exports = router;