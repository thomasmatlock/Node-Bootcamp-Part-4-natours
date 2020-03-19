const express = require('express');
const tourController = require('./../controllers/tourController');

// ROUTERS
const router = express.Router(); // creates new router saved to var. then replace 'app.route' with 'router.route'

// param middleware is middleware that only runs for certain params
// right now, the only param is :id, and we can write middleware that runs for that param
// once again, all middleware has access to the req/res/next function, as well as arg4 which is the value of the param
router.param('id', tourController.checkID)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour); // add param or conditional middleware before default controller

// when we use a new router as middleware, it handles that route, so here we give it the root, and below it only wants the id
// basically handler router is parent path, all subrouting is done by child handlers
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router; // use module.exports when we only have 1 thing to export