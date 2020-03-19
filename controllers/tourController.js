const fs = require('fs');

const devDataToursSimplePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(devDataToursSimplePath)); // JSON.parse will auto convert an array of JS objects

// middleware function to eliminate checking in 3 functions if id is valid
// i like this its very DRY principle. none of the following chained routes need to worry about validation at all -- 
// as opposed to writing a non chained separate function, then calling it in each of the chained routes
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);

    if (req.params.id * 1 >= tours.length) {
        // remember, using return will make sure the next() is never calledz
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    // console.log(val);

    // console.log(`The body.name is ${req.body.name}`);
    // console.log(`The body.price is ${req.body.price}`);

    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid name or price'
        })
    }
    next();
}

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
    // console.log(id);

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

    // notice statuscode for delete is 204, which means 'no content', also we send null as res
    res.status(204).json({
        status: 'success',
        data: null
    });
};