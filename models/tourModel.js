const mongoose = require('mongoose'); // mongoose is npm package that is a middleware that allows our app to connect to our mongodb database
const slugify = require('slugify');

// we create mongoose models out of mongoose schema: we use schema to describe value, define default fields and values, validate data, etc
// pass in schema as an object
// in the scheme obj, we can do it simply, or add options, like required=true, etc
// we also can add an error handler (looks ternary ) for some options: instead of true, use an array containing successful and failure values
// notice w single values we dont need need to encase it in an object
// also, for string types, we can set trim to true, to trim of leading/trailing whitespace characters
// MONGOOSE SCHEMA

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name.'],
            unique: true,
            trim: true
        },
        slug: {
            type: String
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
            required: [true, 'A tour must have a cover image.']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false // auto-removes this field from ever being sent to client (use for sensitive data)
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// virtual properties are basically properties we can define our our schema, but that will not be persisted
// virtual properties make sense with values that can be derived from each other, ie, miles to km. this saves on data back and forth if we can convert it where its at
// here we use a regular function because we need the this keyword, and arrow functions dont get access to the this keyword
// this keyword here is pointing to the current document
// in mongoose, we are going to use regular functions as much as we can
//lastly, these virtual fields dont persist in the database, but only are gotten when we get the document
// in order for virtual fields to show up in the response object, we have to add it above in the schema options
// above we make it so whether we output as JSON or obj, it appears
// one thing to remember, we cant use the virtual field name in queries, ie: 'durationWeeks' cant be used anywhere in our query string
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});
// just like with express middleware, we can use mongoose middleware to have something happen between 2 events
// ie every time a new document is saved to db, we can run a function between the command being issued and the actual saving of the document, or even after its saved
// this is why mongoose middleware is called pre-hook/post-hook
// pre middleware runs before an event
// post middleware runs after an event
// mongoose middleware is defined on the scheme, just like virtual fields
//4 types of mongoose middleware
// document middleware is middleware that can act on the currently processed document
//arg1 is the function name, in this case save: this is a pre-save function
// arg2 is the function that will be called before a document is saved to db
// just like in express we have the next() function
// 1) DOCUMENT MIDDLEWARE
// DOCUMENT MIDDLEWARE, runs before .save() and .create(), but not on insertMany
// hooks are what we call the event, in this case, its a 'save' hook
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true }); // this points to the document being currently processed, options pass in as object
    next();
});
// multiple pre save middleware, multiple pre/post hooks
tourSchema.pre('save', function(next) {
    // console.log('Will save document...');
    next();
});
// post save middleware has access to next(), but also the doc that was just saved, passed to in in params
// post middleware execute after all pre middleware functions have completed
// instead of this keyword, we have the finished document in the doc
tourSchema.post('save', function(doc, next) {
    // console.log(doc);
    next();
});
// 2) QUERY MIDDLEWARE
// Allows us to run middleware pre/post query hook
// below will run before any find() query is executed
// all the this keyword will now point to the current query, not the current document like above in pre document middleware
// below also notice instead of simply the 'find' hook, we want to cover any queries that start with find, so findOne() is also prevented from being queried on secret stuff
// it actually covers find, findOne, findOneAndUpdate, etc
tourSchema.pre(/^find/, function(next) {
    // tourSchema.pre('find', function(next) {
    this.find({ secretTour: { $ne: true } }); //  here send response of queries found that do not contain secretTour field as true, basically send all public tours back
    this.startTime = new Date(); // this sets it as current time in milliseconds
    next();
});

// post-query runs after the query has been executed
// docs refers to all the documents returned from the query
tourSchema.post(/^find/, function(docs, next) {
    // console.log(docs);
    console.log(`Query duration took ${Date.now() - this.startTime} milliseconds`);

    next();
});
// 3) AGGREGATE MIDDLEWARE

// 4) MODEL MIDDLEWARE

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
