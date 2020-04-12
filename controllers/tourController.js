const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    // limit=5&sort=-ratingsAverage,price
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE QUERY > arg1: Tour.find() = query obj, arg2: req.query = queryString (URL)
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .paginate();
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.errmsg
        });
    }
};
exports.getTour = async (req, res) => {
    try {
        // all url variables are stored here in params object
        //mongoose skips mongo's "findOne" to find 1 doc, instead it uses findById, its same as === Tour.findOne({id: req.params.id})
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: err.errmsg,
            message: 'fail'
        });
    }
};
exports.createTour = async (req, res) => {
    // old way to create tour document: create document, then call the method
    // const newTour = new Tour({});
    // newTour.save();

    try {
        //new easier way to create tour document: we basically just call the create method directly on the tour > this returns a promise we await
        // explanation: use Tour model directly > call create method on it > pass it the request body sent by POST request > save it to a variable
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        // console.log(err);
        //400 code = Bad Request
        res.status(400).json({
            status: 'error',
            message: err.errmsg
        });
    }
};
exports.updateTour = async (req, res) => {
    try {
        // findByIdAndUpdate: arg1 = id, arg2 = req.body, arg3 = options
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            // this makes sure it sends back the updated new doc rather than original doc
            // also runValidators checks to ensure the new doc matches our schema
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errmsg
        });
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id); // notice here we dont save the result to a variable, because we dont send anything to client
        res.status(204).json({
            status: 'success'
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errmsg
        });
    }
};
exports.getTourStats = async (req, res) => {
    try {
        // https://docs.mongodb.com/manual/
        // mongoose gives us access to mongodb aggregate method
        // aggregate method takes an array of stages, each stage is an object, like filter objects before. each stage takes the $ sign operator again
        // grouping takes fields (call them anything you want). The values are an object containing an operator and the pre-existing field name with $ added
        // if you wanna group by field, add it: '_id: 'difficulty''
        // TRICKY: to get count of docs, ie all docs going through aggregator, just '$sum: 1', thats is
        // For sort method, we must use the field names we specified in $group stage --- use 1 for ascending, -1 for descending
        // you can repeat stages if you want
        const stats = await Tour.aggregate([{
                $match: {
                    ratingsAverage: {
                        $gte: 4.5
                    }
                }
            },
            {
                $group: {
                    // _id: '$difficulty',
                    _id: {
                        $toUpper: '$difficulty'
                    },
                    // _id: '$ratingsAverage',
                    numTours: {
                        $sum: 1
                    },
                    numRatings: {
                        $sum: '$ratingsQuantity'
                    },
                    avgRating: {
                        $avg: '$ratingsAverage'
                    },
                    avgPrice: {
                        $avg: '$price'
                    },
                    minPrice: {
                        $min: '$price'
                    },
                    maxPrice: {
                        $max: '$price'
                    }
                }
            },
            {
                $sort: {
                    avgPrice: -1
                }
            }
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errmsg
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // year string is coerced into number ---- 2021
        // $unwind method deconstructs an array field from input documents, and output 1 document for each element of the array
        // for example, we have 3 timestamps per document, unwind deconstructs them, and outputs 3 documents each containing an element of the array
        // unwind basically takes whatever field we want and creates an array of all the values in that field
        // for example, if we have 9 docs, and one field has 3 values in an array, it will output 27 docs, each one containing 1 value from the field
        // match: we want it greater or equal to Jan 1 2021, and less/equal to than Dec 31 2021
        // basically this is a 3 stage pipeline:
        // 1) unwind all the startDates
        // 2) match all startDates in 2021,
        // 3) group them by month,
        // we use $month to extract months out of timestamps (check out mongo db date aggregation operators)
        // please remember we use stages > then operators on field names
        const plan = await Tour.aggregate([{
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $month: '$startDates'
                    },
                    numTourStarts: {
                        $sum: 1
                    },
                    tours: {
                        $push: '$name'
                    }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: {
                    _id: 0
                    // month: 0
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            }
            // {
            //     $limit: 12
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errmsg
        });
    }
};

////////////////////////////////////////////////////////////////
// notice we make all the Atlas functions async/await, and give them try/catch

////////////////////////////////////////////////////////////////
// https://mongoosejs.com/docs/queries.html for all query methods
// multiple exports, attach them to exports module using exports.X instead of const then module.exports
// this alias is middleware kind of to manipulate the request obj before moving on the next function, getAllTours: basically it prefills values in the req object

////////////////////////////////////////////////////////////////
// const devDataToursSimplePath = `${__dirname}/../dev-data/data/tours-simple.json`;
// const tours = JSON.parse(fs.readFileSync(devDataToursSimplePath)); // JSON.parse will auto convert an array of JS objects

// middleware function to eliminate checking in 3 functions if id is valid
// i like this its very DRY principle. none of the following chained routes need to worry about validation at all --
// as opposed to writing a non chained separate function, then calling it in each of the chained routes
// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);

//     if (req.params.id * 1 >= tours.length) {
//         // remember, using return will make sure the next() is never calledz
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     // console.log(val);

//     // console.log(`The body.name is ${req.body.name}`);
//     // console.log(`The body.price is ${req.body.price}`);

//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Invalid name or price'
//         })
//     }
//     next();
// }

// exports.createTour = (req, res) => {
//     res.status(201).json({
//         status: 'success',
//         // data: {
//         //     data: newTour
//         // }
//     });
//     // generate new id
//     const newID = tours[tours.length - 1].id + 1;
//     // merge objects, new id, and req data sent
//     // Object.assign allows us to create new obj from merging two different objects together-- notice arg1 is target object, arg2 is source object pulling values from to copy into arg1 object
//     const newTour = Object.assign({
//             id: newID
//         },
//         req.body
//     );

//     // adds new tour to current tour list
//     tours.push(newTour);
//     console.log(tours[tours.length - 1]); // log last tour added

//     // persist new user-added tour locally
//     // JSON stringify to
//     // callbacks are basically functions that run when the method called is complete
//     fs.writeFile(devDataToursSimplePath, JSON.stringify(tours), err => {
//         // send response, newly created object back to client
//         // 201 status code is 'created' successfully
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 data: newTour
//             }
//         });
//     });
// };

// const tour = tours.find(el => el.id === id); // find method stores an array of els that match existing condition aka it loops through tours element ids to match one to the param id
// // console.log(id);

////////////////////////////////////////////////////////////////
// results: `${tours.length - 1}`, // WOW SO HELPFUL. Shows count of results returned to user
// // inside data, the property(ies) should match the API endpoint, ie, tours = tours
// data: {
//     // in ES6 we don't need to specify the key and value if they have the same name.
//     // if the value was different, we would still call the property the same as API endpoint
//     tours
// }

////////////////////////////////////////////////////////////////
// // BUILD QUERY
// // 1A) Filtering
// // here, we want a hard copy of all query key values pairs, and JS, all variables point to the original, so we destructure it off query with ...
// const queryObj = {
//     ...req.query
// };

// const excludedFields = ['page', 'sort', 'limit', 'fields']; // this sets the list of queries we want to ignore
// excludedFields.forEach(el => delete queryObj[el]); // here we loop through excludedFields, each element we want removed from queryObj, delete it from our queryObj

// // send all tours
// // 1B) Advanced Filtering

// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // regex replacing exact match of any of these strings. g allows multiple replacements. also allows callback fn using the match it found

// // get all docs uses exact same method as using mongo shell or compass > find() method also converts JSON of doc to a obj
// let query = Tour.find(JSON.parse(queryStr)); // Json.parse converts to obj, json.stringify converts to string

// // 2) Sorting
// if (req.query.sort) {
//     // sort('price ratingsAverage')
//     const sortBy = req.query.sort.split(',').join(' '); // splits sort query string by commas, then rejoins them with whitespace
//     // console.log(sortBy);

//     query = query.sort(sortBy); // saves version sorted by sort field value, in this case, 'price'
// } else {
//     query = query.sort('-createdAt'); // specifies default sort if user doesnt sort them
// }

// // 3) Field limiting
// if (req.query.fields) {
//     const fields = req.query.fields.split(',').join(' '); // replaces commas w spaces in query fields string
//     query = query.select(fields); // specify list of fields names we will select. Also query.select is called projecting (limiting fields)
//     // console.log(fields);
// } else {
//     query = query.select('-__v'); // default removes field from response if user specifies no fields: doesn't send the mongoose '__v' internally used field back to client
// }

// // 4) Pagination
// // page=2&limit=50 === results 1-10 are on page 1, results 11-20 are on page 2, and so on
// // skip() is the amount of document skips we do before querying data === skip(10) means skip first 10 docs
// // limit is exact same as in query string, limits results to 10 or whatever the limit is
// const page = req.query.page * 1 || 1; // multiply string by 1 to conerce to Number, and sets default value to 1
// const limit = req.query.limit * 1 || 100; // multiply string by 1 to conerce to Number, and sets default value to 1
// const skip = (page - 1) * limit; // formula: page 3 limit 10 = skip 20 results = subtract 1 from desired page > page 2, multiply by limit (10) > skip 20 results
// console.log(page, limit, `skip: ${skip}`);

// query = query.skip(skip).limit(limit); // updates query to only send selected number of tours

// if (req.query.page) {
//     const numTours = await Tour.countDocuments();
//     // console.log(`${numTours} tours in db.`);
//     if (skip >= numTours)
//         // throwing a new error in a try block makes it immediately move on to catch block
//         throw new Error(
//             `There are only ${numTours}, you requested ${skip} tours.`
//         );
// }

////////////////////////////////////////////////////////////////
// aggregation pipeline basically helps us funnel docs in a collection through whateever we want, whether its a bunch of averages for something etc

// eslint-disable-next-line prettier/prettier
////////////////////////////////////////////////////////////////