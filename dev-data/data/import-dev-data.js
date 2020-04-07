const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // npm package that handles our config.env file, useful to toggle between production and development
const Tour = require('./../../models/tourModel');

dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log(`DB connection successful!`));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')); // JSON.parse(converts JSON to JS obj)
// console.log(tours);

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours); // while we normally pass this an object to create a tour, it also accepts an array of objects, in which case it creates a new doc from each array element
        console.log('Success! Data successfully loaded into db');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

// DELETE ALL DB DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany({}); // while we normally pass this an object to create a tour, it also accepts an array of objects, in which case it creates a new doc from each array element
        console.log('Success! Data successfully deleted from db');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

// use command 'node .\dev-data\data\import-dev-data.js --import || --delete' in terminal, process.argv shows us an array of everything about our command list
// console.log(process.argv);
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}