import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./exceptions/CustomAPIError.js";
import fs from 'fs';

export const errorHandler = (err, req, res, next) => {
    const defaultError = new CustomAPIError(
        'INTERNAL SERVER ERROR',
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Server Error",
        "Please Check again after Sometime"
    );

    if (err) {
        defaultError.name = err.name === undefined ? 'INTERNAL SERVER ERROR' : err.name
        defaultError.errorCode = err.errorCode === undefined ? StatusCodes.INTERNAL_SERVER_ERROR : err.errorCode
        defaultError.description = err.description === undefined ? "Server Error" : err.description
        defaultError.details = err.details === undefined ? "Please try again later" : err.details
    }
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            defaultError.details = err.details;
        })
    }
    res.status(defaultError.errorCode).send(defaultError)
}
