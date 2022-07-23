import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './handler/CustomAPIError.js';

export class UnAuthorizedAccess extends CustomAPIError {
   constructor(description, message) {
      super(description, message);
      this.errorCode = StatusCodes.UNAUTHORIZED
   }
}