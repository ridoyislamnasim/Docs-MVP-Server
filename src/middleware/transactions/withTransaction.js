const mongoose = require('mongoose');
const catchError = require('../errors/catchError.js');


const withTransaction = (handler) => {
    return catchError(async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await handler(req, res, next, session);
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            console.log("Failed to start transaction", error);
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    });
};

module.exports = withTransaction;

