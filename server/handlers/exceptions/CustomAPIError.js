export class CustomAPIError extends Error {
   constructor(errorCode, description, message) {
      super(errorCode, description, message);
      this.errorCode = errorCode;
      this.description = description;
      this.message = message
   }
}