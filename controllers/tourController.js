const Tour = require('../models/tourModel');

// https://mongoosejs.com/docs/queries.html for all query methods
// multiple exports, attach them to exports module using exports.X instead of const then module.exports
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);

        // BUILD QUERY
        // 1) Filtering
        // here, we want a hard copy of all query key values pairs, and JS, all variables point to the original, so we destructure it off query with ...
        const queryObj = {
            ...req.query
        };

        const excludedFields = ['page', 'sort', 'limit', 'fields']; // this sets the list of queries we want to ignore
        excludedFields.forEach(el => delete queryObj[el]); // here we loop through excludedFields, each element we want removed from queryObj, delete it from our queryObj

        // send all tours
        // 2) Advanced Filtering

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // regex replacing exact match of any of these strings. g allows multiple replacements. also allows callback fn using the match it found
        console.log(JSON.parse(queryStr));

        // get all docs uses exact same method as using mongo shell or compass > find() method also converts JSON of doc to a obj
        const query = Tour.find(JSON.parse(queryStr)); // Json.parse converts to obj, json.stringify converts to string
        // EXECUTE QUERY
        const tours = await query;

        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
            // results: `${tours.length - 1}`, // WOW SO HELPFUL. Shows count of results returned to user
            // // inside data, the property(ies) should match the API endpoint, ie, tours = tours
            // data: {
            //     // in ES6 we don't need to specify the key and value if they have the same name.
            //     // if the value was different, we would still call the property the same as API endpoint
            //     tours
            // }
        });
    } catch (err) {
        res.status(404).json({
            status: err.errmsg,
            message: err
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
// notice we make all the Atlas functions async/await, and give them try/catch
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
