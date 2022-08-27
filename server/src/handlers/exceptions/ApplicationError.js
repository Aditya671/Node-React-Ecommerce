import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './CustomAPIError.js';

export class ApplicationError extends CustomAPIError {
   constructor(description, details) {
      super("","",description, details);
      this.name = 'Application Error'
      this.errorCode = StatusCodes.BAD_GATEWAY
   }
}