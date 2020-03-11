const fs = require('fs');
const express = require('express');

const app = express(); // calling express adds a bunch of methods to our variable we save it to

// we need this, try commenting it out, it changes client req body json to a req object, without it, its undefined
// app.use allows us to pass it middleware to use to enhance experience, streamline request data, etc, augment http data handling, serverside, for example
app.use(express.json()); // express.json is middleware. middleware modifies or enhances data, usually incoming requests // middleware stands in middle between req and response
// express.json means that the body is added to the request object

const port = 3000; //

// routing is telling the app what to do with different request, and also the request type, get, post etc
// this get method is only called when the base url or / url is sent a get request
// app.get('/', (req, res) => {
//     // res.status(200).send(`Hello from the server side!`); // sends string response
//     // json method is great to send a response in json format
//     res.status(200).json({
//         message: 'Hello from the bloody server',
//         app: `listening on port ${port}`
//     }); // sends json response
// });

// arg1 is client url
// good to specify api versions
// const tours = require('./dev-data/data/tours-simple.json')
// JSON.parse will auto convert an array of JS objects
const devDataToursSimplePath = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const randNum = Math.floor(Math.random() * tours.length);
console.log(tours[randNum].name);
// get tour list by client
app.get('/api/v1/tours', (req, res) => {
    // send all tours
    // usually send status and data, which is the "envelope" which holds our data
    res.status(200).json({
        status: 'success',
        results: `${tours.length}`, // WOW SO HELPFUL. Shows count of results returned to user
        // inside data, the property(ies) should match the API endpoint, ie, tours = tours
        data: {
            // in ES6 we don't need to specify the key and value if they have the same name.
            // if the value was different, we would still call the property the same as API endpoint
            tours
        }
    });
});

// create new tour by client
// in postman, you can customize the request data, by: "Body" tab => "raw" => "JSON"(from dropdown)
app.post('/api/v1/tours', async (req, res) => {
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

    // persist new tour locally
    fs.writeFile(devDataToursSimplePath, json.stringify(tours), err => {
        console.log(err);
    });
    // send response back to client
    res.status(200).json({
        status: 'success',
        data: 'Connection received successfully!'
    });
});

app.post('/', (req, res) => {
    res.send(`You can post to this URL`);
});

app.listen(port, (req, res) => {
    console.log(`App running on port ${port}`);
});
