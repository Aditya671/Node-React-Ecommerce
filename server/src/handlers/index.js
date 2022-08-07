import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./exceptions/CustomAPIError.js";
import fs from 'fs';

export const errorHandler = (err, req, res, next) => {
    const defaultError = new CustomAPIError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Server Error",
        "Please Check again after Sometime"
    );

    if (err) {
        defaultError.errorCode = err.errorCode === undefined ? StatusCodes.INTERNAL_SERVER_ERROR : err.errorCode,
        defaultError.description = err.description === undefined ? "Server Error":err.description,
        defaultError.message = err.message === undefined ? "Please try again later":err.message
    }
    if (req.file) { 
        fs.unlink(req.file.path, (err) => {
            defaultError.message = err.message;
        })
    }
    res.status(defaultError.errorCode).send(defaultError)
}
