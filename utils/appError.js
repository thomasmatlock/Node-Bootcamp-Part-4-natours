// appError extends Error class to inherit all the Error methods or properties
// everytime we extend a class, we also call the parent constructor, super()
class appError extends Error {
    constructor(message, statusCode) {
        // when you call parent class, in this case, the Error class, it takes the error message, which in this case is the message property
        // calling it, we already set the message prop of the Error class to our incoming message
        super(message); // call parent constructor, super, when we extend a class. pass it 'message', cuz its the only param Error constructor class accept

        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'err'; // ternary, if status code starts w 4, then fail, otherwise status is error
        this.operationError = true; // all our operational errors will be set to true. good for debugging later, sending to client or not etc,

        Error.captureStackTrace(this, this.constructor); // when a new obj is createed, and constructor fn is called, that function will not appear in stack trace and pollute it
    }
}

module.exports = appError;
