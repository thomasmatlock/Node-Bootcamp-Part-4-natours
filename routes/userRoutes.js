const express = require('express');
const userController = require('../controllers/userController');

// ROUTE USERS (resource 2)
const router = express.Router(); // creates new router saved to var. then replace 'app.route' with 'tourRouter.route'
router
    .route('/')
    .get(userController.getallUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;