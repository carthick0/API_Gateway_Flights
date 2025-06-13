const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");
const { message } = require("../utils/common/error-response");


function validateAuthRequest(req, res, next) {
    const errors = [];

    if (!req.body.email) {
        errors.push('Email not found in the incoming request or not in correct form');
    }

    if (!req.body.password) {
        errors.push('Password not found in the incoming request or not in correct form');
    }

    if (errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid authentication request',
            data: {},
            error: errors
        });
    }

    next();
}
async function checkAuth(req, res, next) {
    try {
        const userId = await UserService.isAuthenticated(req.headers['x-access-token']);
        req.user = userId;
        next();
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: error.message || "User not authenticated",
            data: {},
            error: error.explanation || [error.message || "Unauthorized access"]
        });
    }
}


async function isAdmin(req, res, next) {
    const response = await UserService.isAdmin(req.userId);

    if (!response) {
        return res.status(StatusCodes.UNAUTHORIZED).
        json({ message: 'User not authorized for this action' })
    }
    next()
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}