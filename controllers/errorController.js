// this is just to section off the error handler for incoming user bad requests
module.exports = (err, req, res, next) => {
    // console.log(err.stack); // shows us where an error happened in the stack when a user tries bad request. terminal top line shows line and position of error

    err.statusCode = err.statusCode || 500; // basically assigns a status code property to be what it is if it is defined, or 500. 500 is internal server error
    err.status = err.status || 'Error';
    res.status(err.statusCode).json({
        status: err.status,
        error: err.message
    });
};
