const fs = require('fs');
const express = require('express');

const app = express(); // calling express adds a bunch of methods to our variable we save it to
const port = 3000;
const devDataToursSimplePath = `${__dirname}/dev-data/data/tours-simple.json`;
// JSON.parse will auto convert an array of JS objects
const tours = JSON.parse(fs.readFileSync(devDataToursSimplePath));

// we need this, try commenting it out, it changes client req body json to a req object, without it, its undefined
// app.use allows us to pass it middleware to use to enhance experience, streamline request data, etc, augment http data handling, serverside, for example
// express.json means that the body is added to the request object
app.use(express.json()); // express.json is middleware. middleware modifies or enhances data, usually incoming requests // middleware stands in middle between req and response

// get all tours
const getAllTours = (req, res) => {
    // send all tours
    // usually send status and data, which is the "envelope" which holds our data
    res.status(200).json({
        status: 'success',
        results: `${tours.length - 1}`, // WOW SO HELPFUL. Shows count of results returned to user
        // inside data, the property(ies) should match the API endpoint, ie, tours = tours
        data: {
            // in ES6 we don't need to specify the key and value if they have the same name.
            // if the value was different, we would still call the property the same as API endpoint
            tours
        }
    });
};
// get specific tour by id
const getTour = (req, res) => {
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

app.get('/api/v1/tours', getAllTours);

// define variable using a colon
// however, you may be missing one or more variables, then make those optional with a '?' after it ie: '/api/v1/tours/:id/:name?/:type?'
app.get('/api/v1/tours/:id', getTour);

// create new tour by client
// in postman, you can customize the request data, by: "Body" tab => "raw" => "JSON"(from dropdown)
app.post('/api/v1/tours', (req, res) => {
    // generate new id
    const newID = tours[tours.length - 1].id + 1;
    // merge objects, new id, and req data sent
    // Object.assign allows us to create new obj from merging two different objects together-- notice arg1 is target object, arg2 is source object pulling values from to copy into arg1 object
    const newTour = Object.assign(
        {
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
});

app.post('/', (req, res) => {
    res.send(`You can post to this URL`);
});

// PUT expects the entire updated obj, whereas PATCH expects only the properties that will be updated on the object
// just like POST,  you need to include body content in raw JSON
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

// turn server on
app.listen(port, (req, res) => {
    console.log(`App running on port ${port}`);
});
