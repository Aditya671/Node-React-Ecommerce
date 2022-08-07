
import { StatusCodes } from "http-status-codes";
import Joi from "joi"
import { CustomAPIError } from "../handlers/exceptions/CustomAPIError.js";

class AuthValidator{
    constructor(){
        this.className="AuthValidator"
    }
    static __selfStart__(){
        return console.log(`\n----- ${this.name} -> Start\n`)
    }
    static __selfEnd__(){
        return console.log(`\n----- ${this.name} -> End\n`)
    }

    async authenticateFields(fieldsObj = {},next){
        try{
            AuthValidator.__selfStart__()
            if (typeof fieldsObj !== "object" || fieldsObj.length != 0){
                const isValid = Joi.object({
                    username:Joi.string().label('User Name'),
                    email:Joi.string().email().label('Email'),
                    phone:Joi.string().max(15).optional().label('Mobile No.'),
                    password:Joi.string().required().label('Password'),
                    confirmPassword:Joi.any().valid(Joi.ref('password')).required().messages({
                       "any.only" : "Password and Confirm Password must match",
                       "string.empty":"Please re enter your Password"
                    }).label('Confirm Password'),
                    rememberMe:Joi.valid(true,false).required(), 
                })
                return isValid.validate(fieldsObj);
            }
            else{
                throw new CustomAPIError(StatusCodes.BAD_REQUEST,"Parameters Undefined","")
            }
        }catch(err){
            next(err)
        }finally{
            AuthValidator.__selfEnd__()
            console.log(`\n----- ${this.className} -> authenticateFields Method \n`)
        }
    }
}
export default AuthValidator;