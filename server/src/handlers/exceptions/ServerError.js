import { CustomAPIError } from "./CustomAPIError.js";
import { StatusCodes } from 'http-status-codes';


class ServerError extends CustomAPIError {
   constructor(description,details) {
      super(null,null,description,details);
      this.name = "SERVER ERROR"
      this.errorCode = StatusCodes.INTERNAL_SERVER_ERROR
   }
}
export default ServerError