
import Joi from "joi"

class AuthValidator{

    static __self__(){
        return console.log('\n----- Validator -> AuthValidator ->\n')
    }

    authenticateFields(fieldsObj,next){
        try{
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
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- AuthValidator -> authenticateFields Method \n')   
        }
    }
}
export default AuthValidator;