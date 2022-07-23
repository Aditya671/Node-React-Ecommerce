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
        defaultError.errorCode = err.errorCode,
            defaultError.description = err.description,
            defaultError.message = err.message
    }
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            defaultError.message = err.message;
        })
    }
    console.log(err)
    res.status(defaultError.errorCode).send(defaultError.message)
}
