const mongoose = require('mongoose'); // mongoose is npm package that is a middleware that allows our app to connect to our mongodb database
const dotenv = require('dotenv'); // npm package that handles our config.env file, useful to toggle between production and development
const app = require('./app');

// reads our config.env file and save them to nodejs env variable
dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);

// mongoose.connect returns a promise, so we can use .then(), then() gets access to the connection obj
// we name it 'con' for connection, and its the results of the returned promise
// arg1, db connection string; arg2, obj that is some options to deal w deprecation warnings
// dont worry about the 3 arg2 properties right now. make them exactly the same in my own projects
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log(`DB connection successful!`));
// console.log(app.get('env')); // shows us whether in dev or production env. default is dev
// console.log(process.env); // WOW THIS IS THE SHIT! look at all the  environment vars we have to use for Warp!
// change environment: in terminal, preface your 'npm start'/'nodemon server.js' with 'NODE_ENV=production' or 'NODE_ENV=development', then check logged env vars, it will show it as changed
// to change more, use 'NODE_ENV=development X=23 npm start' and it will update accordingly

// we create mongoose models out of mongoose schema: we use schema to describe value, define default fields and values, validate data, etc
// pass in schema as an object
// in the scheme obj, we can do it simply, or add options, like required=true, etc
// we also can add an error handler (looks ternary ) for some options: instead of true, use an array containing successful and failure values
// MONGOOSE SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    }
});

// MONGOOSE MODEL
// mongoose convention to always use uppercase on models
// arg1 = name of model, arg2 = schema of model
const Tour = mongoose.model('Tour', tourSchema);

// START SERVER
const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    // console.log(`App running on port ${port}`);
});