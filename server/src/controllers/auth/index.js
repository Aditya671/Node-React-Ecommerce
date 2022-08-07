import { StatusCodes } from "http-status-codes";
import AuthValidator from '../../validators/auth-validator.js';
import {UnAuthorizedAccess} from '../../handlers/exceptions/UnAuthorizedAccess.js'
import {ValidationError} from "../../handlers/exceptions/ValidationError.js";
import bcrypt from "bcryptjs";
import Authentication from "../../middleware/authentication.js";
class Auth{
    constructor(){
        this.className = "Auth";
        this.authSignature = new  Authentication();
    }
    static __selfStart__(){
        return console.log(`\n----- ${this.name} -> Start\n`)
    }
    static __selfEnd__(){
        return console.log(`\n----- ${this.name} -> End\n`)
    }
    async postLogin(req,res,next){
        try{
           Auth.__selfStart__()
            let user = ''
            const {email,username,phone,password} = req.body;
            const validator = new AuthValidator()
            const isValid = await validator.authenticateFields(req.body,next);

            if (!isValid.error){
                if(email){
                    user = isValid.value.email
                }else if (username){
                    user = isValid.value.username
                }else if(phone){
                    user = isValid.value.phone
                }else{
                    user = email ? email : (username ? username : (phone ? phone : undefined) )
                    throw UnAuthorizedAccess(
                        `Invalid User ${user}`,
                        "Please Provide Correct Login"
                    )
                }
            }else{
                let errorDetails = isValid.error.details
                let errorValues = Object.values(errorDetails).map(item => {
                    return {
                        fieldName:item.context.label,
                        message:item.message
                    }
                })
                throw new ValidationError(errorValues);
            }
            let token = '';
            const isPasswordCorrect  = await bcrypt.compare(user.password, password);
            if (isPasswordCorrect){
                const data = {email:email,user:user};
                token = this.authSignature.signJWTToken(data,next);
            }else{
                throw UnAuthorizedAccess(
                    `Invalid User Password: ${user}`,
                    "Please Provide Correct Password"
                ) 
            }
            req.session.isLoggedIn = true
            user.password = undefined
            req.session.user = user
            res.status(StatusCodes.OK).send({user,token})
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- Auth -> postLogin Method Called ->\n`)
            Auth.__selfEnd__()
        }
    }
    postRegister(req,res,next){
        try{
            Auth.__selfStart__()
            let user = ''
            const {email,username,phone,password} = req.body;
            const isValid = this.authenticateFields(req.body,next);
            if (!isValid.error){
                if(email === 'test@gmail.com'){
                    throw UnAuthorizedAccess("User Alredy Exist")
                }else if (username === 'Aditya Gupta'){
                    throw UnAuthorizedAccess("User Alredy Exist")
                }else if(phone === '+91-(000) 000 0000'){
                    throw UnAuthorizedAccess("User Alredy Exist")
                }else{
                    user = email ? email : (username ? username : (phone ? phone : undefined) )
                }
            }else{
                let errorDetails = isValid.error.details
                let errorValues = Object.values(errorDetails).map(item => {
                    return {
                        fieldName:item.context.label,
                        message:item.message
                    }
                })
                throw new ValidationError(errorValues);
            }
            let token = '';
            token = this.authSignature.signJWTToken(data,next);
            
            req.session.isLoggedIn = true
            user.password = undefined
            req.session.user = user
            res.status(StatusCodes.OK).send({user,token})
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- ${Auth.name} -> postRegister Method Called ->\n`)
            Auth.__selfEnd__()
        }        
    }
    postLogout(req,res,next){
        try{
            Auth.__selfStart__()
            req.session.destroy(err => {
                console.log(err)
            })
            res.status(StatusCodes.OK).send({'msg':'Redirect to Login Page'})    
        }catch(err){
            next(err)
        }finally{            
            console.log(`\n----- ${this.className} -> postLogout Method Called ->\n`)
            Auth.__selfEnd__()
        }     
    }
}
export default Auth;