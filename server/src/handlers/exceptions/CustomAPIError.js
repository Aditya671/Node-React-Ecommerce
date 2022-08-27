export class CustomAPIError extends Error {
   constructor(name,errorCode, description, message) {
      super(name,errorCode, description, message);
      this.name = name;
      this.errorCode = errorCode;
      this.description = description;
      this.message = message
   }
}