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

// eslint-disable-next-line prettier/prettier
////////////////////////////////////////////////////////////////