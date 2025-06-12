const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const userRepository = new UserRepository();

async function create(data) {
    try {
        const user = await userRepository.create(data)
        return user;
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const explanation = error.errors.map(err => err.message);
            throw new AppError('Cannot create a new user', StatusCodes.BAD_REQUEST, explanation);
        }
        throw new AppError('Cannot create a new user', StatusCodes.INTERNAL_SERVER_ERROR, [error.message]);
    }
}

module.exports = { create }