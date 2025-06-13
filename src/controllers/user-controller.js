const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function create(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User created successfully",
            data: user,
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Something went wrong while creating user",
            data: {},
            error: error.explanation || [error.message]
        });
    }
}

async function signin(req, res) {
    try {
        const token = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User logged in successfully",
            data: { token },
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Something went wrong while logging user",
            data: {},
            error: error.explanation || [error.message]
        });
    }
}

async function addRole(req, res) {
    try {
        const token = await UserService.addRoleToUser({
            role: req.body.role,
            id: req.body.id
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User role added Successful",
            data: { token },
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Something went wrong while adding role",
            data: {},
            error: error.explanation || [error.message]
        });
    }
}

module.exports = {
    create,
    signin,
    addRole
};