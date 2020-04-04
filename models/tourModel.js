const mongoose = require('mongoose'); // mongoose is npm package that is a middleware that allows our app to connect to our mongodb database

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
// create an instance of the Tour model
// mongoose convention to always use uppercase on models
// arg1 = name of model, arg2 = schema of model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// create new document out of our tour model

// save the instance to the document database
// .save() returns a promise that we then consume
// the returned promise is the final document in the database, and we we will name it 'doc'