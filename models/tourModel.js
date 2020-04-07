const mongoose = require('mongoose'); // mongoose is npm package that is a middleware that allows our app to connect to our mongodb database


// we create mongoose models out of mongoose schema: we use schema to describe value, define default fields and values, validate data, etc
// pass in schema as an object
// in the scheme obj, we can do it simply, or add options, like required=true, etc
// we also can add an error handler (looks ternary ) for some options: instead of true, use an array containing successful and failure values
// notice w single values we dont need need to encase it in an object
// also, for string types, we can set trim to true, to trim of leading/trailing whitespace characters
// MONGOOSE SCHEMA


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a max group size.']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty.']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary.']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have an image.']
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
// just learned arrays are useful for single value lists, like an array of objects, values, whatever, if you dont need to have a name for every value in the list