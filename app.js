const fs = require('fs');
const express = require('express');
const app = express(); // calling express adds a bunch of methods to our variable we save it to
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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
const randNum = Math.floor(Math.random() * tours.length);
console.log(tours[randNum].name);
app.get('api/v1/tours', (req, res) => {
    // send all tours
    res.status(200).json({
        status: 'success'
    });
});

app.post('/', (req, res) => {
    res.send(`You can post to this URL`);
});

app.listen(port, (req, res) => {
    console.log(`App running on port ${port}`);
});
