export class CustomAPIError extends Error {
   constructor(name,errorCode, description, details) {
      super(name,errorCode, description, details);
      this.name = name;
      this.errorCode = errorCode;
      this.description = description;
      this.details = details
   }
}