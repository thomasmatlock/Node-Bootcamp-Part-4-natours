const dotenv = require('dotenv'); // npm package that handles our config.env file, useful to toggle between production and development

// reads our config.env file and save them to nodejs env variable
dotenv.config({
    path: './config.env'
});
const app = require('./app');
console.log(app.get('env')); // shows us whether in dev or production env. default is dev
// console.log(process.env); // WOW THIS IS THE SHIT! look at all the  environment vars we have to use for Warp!
// change environment: in terminal, preface your 'npm start'/'nodemon server.js' with 'NODE_ENV=production' or 'NODE_ENV=development', then check logged env vars, it will show it as changed
// to change more, use 'NODE_ENV=development X=23 npm start' and it will update accordingly

// START SERVER

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    // console.log(`App running on port ${port}`);
});
