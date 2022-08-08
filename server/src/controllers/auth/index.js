import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import AuthValidator from '../../validators/auth-validator.js';
import {UnAuthorizedAccess} from '../../handlers/exceptions/UnAuthorizedAccess.js'
import {ValidationError} from "../../handlers/exceptions/ValidationError.js";
import Authentication from "../../middleware/authentication.js";
import userCredential from "../../models/auth/index.js";
import usersSchema from "../../models/users/index.js";

class Auth{
    constructor(){
        this.className = "Auth";
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
                    user = await userCredential.findOne({email}).exec()
                }else if (username){
                    user = await userCredential.findOne({username}).select('+password')
                }else if(phone){
                    user = await userCredential.findOne({phone}).select('+password')
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
            if (user){
                const isPasswordCorrect  = await bcrypt.compare(user.password, password);
                if (isPasswordCorrect){
                    const data = {email:email,user:user.password};
                    const authSignature = new Authentication();
                    const token = await authSignature.signJWTToken(data,next);
                    req.session.isLoggedIn = true
                    user.password = undefined
                    req.session.user = user
                    res.status(StatusCodes.OK).send({user,token})
    
                }else{
                    throw UnAuthorizedAccess(
                        `Invalid User Password: ${user}`,
                        "Please Provide Correct Password"
                    )
                }
            }else{
                throw UnAuthorizedAccess(
                    `Invalid User: ${user}`,
                    "User does Not Exist"
                )
            }

        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- Auth -> postLogin Method Called ->\n`)
            Auth.__selfEnd__()
        }
    }
    async postRegister(req,res,next){
        try{
            Auth.__selfStart__()
            let user = ''
            const {email,username,phone,password} = req.body;
            const validator = new AuthValidator()
            const isValid = await validator.authenticateFields(req.body,next);
            if (!isValid.error){
                if(email){
                    user = await userCredential.findOne({email}).select('+password').exec()
                }else if (username){
                    user = await userCredential.findOne({username}).select('+password').exec()
                }else if(phone){
                    user = await userCredential.findOne({phone}).select('+password').exec()
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
            if(!user){
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(isValid.value.password,salt); 
                if (isValid.value.email){
                    
                    user = await userCredential.create({
                        email:isValid.value.email,
                        password:passwordHash
                    })
                    const schemaUser = usersSchema.create({
                        userId:user._id,
                        email:isValid.value.email,
                        password:isValid.value.password
                    })
                }
                const data = {
                    'userId':user._id
                }
                const authSignature = new Authentication();
                const token = await authSignature.signJWTToken(data,next);
                
                req.session.isLoggedIn = true
                user.password = undefined
                req.session.user = user
                res.cookie('jwt', token, { httpOnly: true, 
                    sameSite: 'None', secure: true, 
                    maxAge: 24 * 60 * 60 * 1000 });
                res.status(StatusCodes.OK).send({user,token})
            }else{

            }
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- ${Auth.name} -> postRegister Method Called ->\n`)
            Auth.__selfEnd__()
        }        
    }
    async postLogout(req,res,next){
        try{
            Auth.__selfStart__()
            req.session.destroy(err => {
                next(err)
            })
            res.status(StatusCodes.OK).send({'msg':'Redirect to Login Page'})    
        }catch(err){
            next(err)
        }finally{            
            console.log(`\n----- ${this.className} -> postLogout Method Called ->\n`)
            Auth.__selfEnd__()
        }     
    }
    async postRefreshToken(req,res,next){
        try{
            Auth.__selfStart__()
            const refreshJWTCookie = req.cookies?.jwt;
            if(refreshJWTCookie){
                const authSignature = new Authentication();
                const refreshTokenValue = refreshJWTCookie['refreshToken']
                const refreshToken = await authSignature.verifyRefreshToken(refreshTokenValue,next)
                if(refreshToken){
                    const tokenDecoder = refreshJWTCookie['accessToken'].split('.')[1]
                    const decodeValue = JSON.parse(window.atob(tokenDecoder));
                    const newAccessToken = await authSignature.signJWTToken(decodeValue,next)
                    if (newAccessToken) {
                        req.session.isLoggedIn = true
                        user.password = undefined
                        req.session.user = user
                        res.cookie('jwt', token, { httpOnly: true, 
                            sameSite: 'None', secure: true, 
                            maxAge: 24 * 60 * 60 * 1000 });
                            res.status(StatusCodes.OK).send({decodeValue,newAccessToken})
    
                    }
                }
            }
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- ${this.className} -> postRefreshToken Method Called ->\n`)
            Auth.__selfEnd__()
        }
    }
}
export default Auth;