const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");
const e = require("express");
const { error } = require("../utils/common/error-response");

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

async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                'No user found for the email given',
                StatusCodes.BAD_REQUEST, ['User does not exist with the given email']
            );
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        console.log("password match", passwordMatch)
        if (!passwordMatch) {
            throw new AppError(
                'The password you enter is invalid',
                StatusCodes.BAD_REQUEST, ['Incorrect password']
            );
        }

        const jwt = Auth.createToken({ id: user.id, email: user.email });
        return jwt;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, [error.message])
    }
}

async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST)
        }
        const response = Auth.verifyToken(token);

        const user = await userRepository.getById(response.id);
        if (!user) {
            throw new AppError('NO user found', StatusCodes.NOT_FOUND)
        }
        return user.id;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name === "JsonWebTokenError") {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST)
        }
    }
}

module.exports = { create, signin, isAuthenticated }