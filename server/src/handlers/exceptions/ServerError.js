import { CustomAPIError } from "./CustomAPIError.js";
import { StatusCodes } from 'http-status-codes';


class ServerError extends CustomAPIError {
   constructor(description,message) {
      super(null,null,description,message);
      this.name = "SERVER ERROR"
      this.errorCode = StatusCodes.INTERNAL_SERVER_ERROR
   }
}
export default ServerError