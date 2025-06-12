const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function create(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        })

        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        ErrorResponse.message = 'Something went wrong while creating user'
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}

module.exports = {
    create
}