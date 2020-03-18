const express = require('express');
const tourController = require('./../controllers/tourController')

// ROUTERS
const router = express.Router(); // creates new router saved to var. then replace 'app.route' with 'router.route'
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

// when we use a new router as middleware, it handles that route, so here we give it the root, and below it only wants the id
// basically handler router is parent path, all subrouting is done by child handlers
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router; // use module.exports when we only have 1 thing to export