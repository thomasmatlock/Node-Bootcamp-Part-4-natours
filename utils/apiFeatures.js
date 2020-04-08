class APIFeatures {
    // constructor is what gets called every time we create a new object out of this class
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A) Filtering
        // here, we want a hard copy of all query key values pairs, and JS, all variables point to the original, so we destructure it off query with ...
        const queryObj = {
            ...this.queryString
        };
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // this sets the list of queries we want to ignore
        excludedFields.forEach(el => delete queryObj[el]); // here we loop through excludedFields, each element we want removed from queryObj, delete it from our queryObj

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // regex replacing exact match of any of these strings. g allows multiple replacements. also allows callback fn using the match it found

        // get all docs uses exact same method as using mongo shell or compass > find() method also converts JSON of doc to a obj
        this.query = this.query.find(JSON.parse(queryStr)); // Json.parse converts to obj, json.stringify converts to string

        return this; // returning every method allows us to chain methods together using the previously returned obj each time. return this returns entire obj
    }

    sort() {
        if (this.queryString.sort) {
            // sort('price ratingsAverage')
            const sortBy = this.queryString.sort.split(',').join(' '); // splits sort query string by commas, then rejoins them with whitespace
            // console.log(sortBy);

            this.query = this.query.sort(sortBy); // saves version sorted by sort field value, in this case, 'price'
        } else {
            this.query = this.query.sort('-createdAt'); // specifies default sort if user doesnt sort them
        }
        return this; // returning every method allows us to chain methods together using the previously returned obj each time. return this returns entire obj
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' '); // replaces commas w spaces in query fields string
            this.query = this.query.select(fields); // specify list of fields names we will select. Also this.query.select is called projecting (limiting fields)
            // console.log(fields);
        } else {
            this.query = this.query.select('-__v'); // default removes field from response if user specifies no fields: doesn't send the mongoose '__v' internally used field back to client
        }

        return this; // returning every method allows us to chain methods together using the previously returned obj each time. return this returns entire obj
    }

    paginate() {
        // page=2&limit=50 === results 1-10 are on page 1, results 11-20 are on page 2, and so on
        // skip() is the amount of document skips we do before querying data === skip(10) means skip first 10 docs
        // limit is exact same as in query string, limits results to 10 or whatever the limit is
        const page = this.queryString.page * 1 || 1; // multiply string by 1 to conerce to Number, and sets default value to 1
        const limit = this.queryString.limit * 1 || 100; // multiply string by 1 to conerce to Number, and sets default value to 1
        const skip = (page - 1) * limit; // formula: page 3 limit 10 = skip 20 results = subtract 1 from desired page > page 2, multiply by limit (10) > skip 20 results
        // console.log(page, limit, `skip: ${skip}`);
        this.query = this.query.skip(skip).limit(limit); // updates query to only send selected number of tours

        return this; // returning every method allows us to chain methods together using the previously returned obj each time. return this returns entire obj
    }
}

// eslint-disable-next-line prettier/prettier
module.exports = APIFeatures;