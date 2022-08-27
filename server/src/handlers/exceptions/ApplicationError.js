import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './CustomAPIError.js';

export class ApplicationError extends CustomAPIError {
   constructor(description, message) {
      super("","",description, message);
      this.name = 'Application Error'
      this.errorCode = StatusCodes.BAD_GATEWAY
   }
}