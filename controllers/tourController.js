const fs = require('fs');

const devDataToursSimplePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(devDataToursSimplePath)); // JSON.parse will auto convert an array of JS objects

// multiple exports, attach them to exports module using export.X instead of const then export
exports.getAllTours = (req, res) => {
    // send all tours
    // usually send status and data, which is the "envelope" which holds our data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: `${tours.length - 1}`, // WOW SO HELPFUL. Shows count of results returned to user
        // inside data, the property(ies) should match the API endpoint, ie, tours = tours
        data: {
            // in ES6 we don't need to specify the key and value if they have the same name.
            // if the value was different, we would still call the property the same as API endpoint
            tours
        }
    });
};
exports.getTour = (req, res) => {
    // console.log(req.params); // all url variables are stored here in params object
    const id = req.params.id * 1; // JS weirdly converts strings that look like numbers to actual numbers
    const tour = tours.find(el => el.id === id); // find method stores an array of els that match existing condition aka it loops through tours element ids to match one to the param id
    console.log(id);

    // if (id >= tours.length) {

    if (!tour) {
        console.log(`No good, tour ${id} is undefined`);
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    });
};
exports.createTour = (req, res) => {
    // generate new id
    const newID = tours[tours.length - 1].id + 1;
    // merge objects, new id, and req data sent
    // Object.assign allows us to create new obj from merging two different objects together-- notice arg1 is target object, arg2 is source object pulling values from to copy into arg1 object
    const newTour = Object.assign({
            id: newID
        },
        req.body
    );

    // adds new tour to current tour list
    tours.push(newTour);
    console.log(tours[tours.length - 1]); // log last tour added

    // persist new user-added tour locally
    // JSON stringify to
    // callbacks are basically functions that run when the method called is complete
    fs.writeFile(devDataToursSimplePath, JSON.stringify(tours), err => {
        // send response, newly created object back to client
        // 201 status code is 'created' successfully
        res.status(201).json({
            status: 'success',
            data: {
                data: newTour
            }
        });
    });
};
exports.updateTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id;
    // if (id >= tours.length) {
    if (req.params.id * 1 >= tours.length) {
        console.log(`No good, tour ${id} is undefined`);
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated tour here...'
        }
    });
};
exports.deleteTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id;
    // if (id >= tours.length) {
    if (req.params.id * 1 >= tours.length) {
        console.log(`No good, tour ${id} is undefined`);
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    // notice statuscode for delete is 204, which means 'no content', also we send null as res
    res.status(204).json({
        status: 'success',
        data: null
    });
};