import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './CustomAPIError.js';

export class UnAuthorizedAccess extends CustomAPIError {
   constructor(description, details) {
      super("","",description, details);
      this.name = 'Unauthorized Access'
      this.errorCode = StatusCodes.UNAUTHORIZED
   }
}