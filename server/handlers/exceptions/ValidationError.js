import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './handler/CustomAPIError.js';

export class ValidationError extends CustomAPIError {
   constructor(description) {
      super(description);
      this.errorCode = StatusCodes.BAD_REQUEST
      this.message = "Issue with Provided Entries"
      this.description = description
   }
}