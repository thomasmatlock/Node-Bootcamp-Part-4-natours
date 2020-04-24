/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // npm package that handles our config.env file, useful to toggle between production and development

dotenv.config({
    path: './config.env'
});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log(`DB connection successful!`));

const port = process.env.PORT || 3000; // START SERVER

app.listen(port, (req, res) => {
    console.log(`App running on port ${port}`);
});

// TEST NDB COMMENT

////////////////////////////////////////////////////////////////
// NDB debugging
// click left of any line to add a breakpoint. it will stop at that line
// executes everything ABOVE that line, not the breakpoint line, or below it
// right click > run this file 
// controls are on top right, step over/into/out of functions
// control pane on right side, shows us in Scope we have access to 5 vars in every module: this Obj (__dirname, __filename, etc), require, module, exports
// app variables is our express application we export from app.js 
// right panel, go to scope > local variables > app > _router > stack. The "stack" is the middleware stack we have in our application
// also, go to scope > global variables > process > env --- you can see our global environment variables WOW, LOOK AT ALL THE VARIABLES
// so basically, at any point in time, you can pause the program, to see exactly what is what, its kind of like advanced console logging
// Breakpoint in Get All Tours, after processing request, BEFORE sending response back, and right pane > scope > local > you see req, res, this, features, etc, you can examine the req object
// it really is an amazing tool to use instead of tons of console logs
// you can looks at the Block > Tours, expand it you can see all the data we already grabbed from MDB, little bit different layout with ellipses you need to expand to see the values
// also "features" is there, as instance of APIFeatures, just as we defined it, with query, and querystring


////////////////////////////////////////////////////////////////
// reads our config.env file and save them to nodejs env variable
// dotenv.config({
//     path: './config.env'
// });

////////////////////////////////////////////////////////////////
// mongoose.connect returns a promise, so we can use .then(), then() gets access to the connection obj
// we name it 'con' for connection, and its the results of the returned promise
// arg1, db connection string; arg2, obj that is some options to deal w deprecation warnings
// dont worry about the 4 arg2 properties right now. make them exactly the same in my own projects

////////////////////////////////////////////////////////////////
// console.log(app.get('env')); // shows us whether in dev or production env. default is dev
// console.log(process.env); // WOW THIS IS THE SHIT! look at all the  environment vars we have to use for Warp!
// change environment: in terminal, preface your 'npm start'/'nodemon server.js' with 'NODE_ENV=production' or 'NODE_ENV=development', then check logged env vars, it will show it as changed
// to change more, use 'NODE_ENV=development X=23 npm start' and it will update accordingly
////////////////////////////////////////////////////////////////
// eslint-disable-next-line prettier/prettier
////////////////////////////////////////////////////////////////