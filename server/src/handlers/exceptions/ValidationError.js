import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './CustomAPIError.js';

export class ValidationError extends CustomAPIError {
   constructor(description) {
      super(null,null,description,null);
      this.name = 'Validation Error'
      this.errorCode = StatusCodes.BAD_REQUEST
      this.message = "Issue with Provided Entries"
   }
}