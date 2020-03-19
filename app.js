const express = require('express');
const morgan = require('morgan'); // morgan is a middleware that simplifies how req object in console
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARE
const app = express(); // calling express adds a bunch of methods to our variable we save it to

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // pass morgan predefined string (6 options or so) to define how we want our req object to look when its console logged
}
app.use(express.json()); // express.json is middleware. middleware modifies or enhances data, usually incoming requests // middleware stands in middle between req and response
// these are available in browser, as long as full path is there/ partial paths like /img dont work, cuz it thinks its a route
app.use(express.static(`${__dirname}/public`)); // this makes available static files, then the folder they are located in

app.use((req, res, next) => {
    // console.log(`Hello from the middleware`);
    req.requestTime = new Date().toISOString(); // toISOString converts datetime to nice readable string
    // we need to call next method, or else express will be stuck here forever
    next();
});

// MOUNTED ROUTERS
app.use('/api/v1/tours', tourRouter); // we want arg2 to handle everything sent to arg1, the endpoint. args: endpoint, router to handle it
app.use('/api/v1/users', userRouter); // we want arg2 to handle everything sent to arg1, the endpoint. args: endpoint, router to handle it

module.exports = app; // export to server.js for use

//  FLOW:
// request enter via app.js, then gets passed to one of the 2 routers we mounted to handle them
// the routers then run the controllers attached to them
// app.js => mounted routers => router file => controller file
// its good practice to separate express and server.js file

// we need this, try commenting it out, it changes client req body json to a req object, without it, its undefined
// app.use allows us to pass it middleware to use to enhance experience, streamline request data, etc, augment http data handling, serverside, for example
// express.json means that the body is added to the request object
// define variable using a colon
// however, you may be missing one or more variables, then make those optional with a '?' after it ie: '/api/v1/tours/:id/:name?/:type?'
// in postman, you can customize the request data, by: "Body" tab => "raw" => "JSON"(from dropdown)
// PUT expects the entire updated obj
// PATCH expects only the properties that will be updated on the object, Jonas likes it better, same here
// just like POST,  you need to include body content in raw JSON
// app.route chaining only works for methods that share same root, ie no params or w/e

// https://expressjs.com/en/resources/middleware.html for all middlewares you can use and that express recommends
// https://expressjs.com/en/4x/api.html to check out all methods available for res/req etc
// routes are also middleware, they only turn on in specified cases, URL matches arg1 etc
// we use app.use to use middleware, aka add middleware to our middleware stack
// calling that express.json function adds it to our middleware stack
// we can create our own middleware stack
// how to define a middleware, pass res/req objects and the next() method as args to app.use, and express knows we are defining a middleware
// we can call next whatever we want, but arg3 is accepts as the next method
// console.log(`${__dirname}/../dev-data`); // you get cwd, go up 1 folder, and select what you want. use consolelog to print some these, its easy

// MOUNTING A ROUTER (using a new router as middleware on an existing route to handle it, then using prexisting routing to handle sub routing)
// all routers are running off of the 'app' object. to split routing into multiple files for cleaner code, we need to create a router for each of the resources
// there will be 4 files, 2 handlers for users and tours, 2 routers for users and tours, then a router to handle all them
// we need to use our new router as middleware using express.use()
// this arg2 router, in turn, has its own routes
// basically when a req comes in, if it matches arg1, the endpoint, it will run the arg2, the router in charge of handling w/e comes to that endpoint
// now we split the files, basically we created small apps, imported them, and mounted them on the ENDPOINTS (api/v1/tours|users) to handle requests to those endpoints

// 65, env variables
// most important environments are dev env, and production env
