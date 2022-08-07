import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './CustomAPIError.js';

export class UnAuthorizedAccess extends CustomAPIError {
   constructor(description, message) {
      super(description, message);
      this.errorCode = StatusCodes.UNAUTHORIZED
   }
}