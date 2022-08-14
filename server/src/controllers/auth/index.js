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
                const isPasswordCorrect  = await bcrypt.compareSync(password,user.password);
                if (isPasswordCorrect){
                    const data = {email:email,userId:user.id};
                    const authSignature = new Authentication();
                    const token = await authSignature.signJWTToken(data,next);
                    req.session.isLoggedIn = true
                    user.password = undefined
                    req.session.user = data
                    req.session.token = token['refreshToken']
                    res.status(StatusCodes.OK).send({user:data,token:token['accessToken']})
    
                }else{
                    throw new UnAuthorizedAccess(
                        `Invalid User Password: ${user.id}`,
                        "Please Provide Correct Password"
                    )
                }
            }else{
                throw new UnAuthorizedAccess(
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
            let user = null
            const {email,username,phone,password} = req.body;
            const validator = new AuthValidator();
            const authSignature = new Authentication();
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
                    const schemaUser = await usersSchema.create({
                        userId:user?.id,
                        email:isValid.value.email,
                        password:isValid.value.password
                    })
                }
                const data = {
                    email:user?.email,
                    userId:user?.id
                }
                const token = await authSignature.signJWTToken(data,next);
                
                req.session.isLoggedIn = true
                user.password = undefined
                req.session.user = data
                req.session.token = token['refreshToken']
                // res.cookie('jwt', token, { httpOnly: true, 
                //     sameSite: 'None', secure: true, 
                //     maxAge: 24 * 60 * 60 * 1000 });
                res.status(StatusCodes.OK).send({user:data,token:token['accessToken'] })
            }else{
                throw new UnAuthorizedAccess(
                    "Please enter new details",
                    `User "${user.id}" already exists`
                )
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
            console.log(`\n----- ${Auth.name} -> postLogout Method Called ->\n`)
            Auth.__selfEnd__()
        }     
    }
    async postRefreshToken(req,res,next){
        try{
            Auth.__selfStart__()
            /* Method to follow if cookie was sent directly in this Way:
            Example: res.cookie('jwt',............)
             
            const refreshJWTCookie = req.cookies?.jwt;
            if(refreshJWTCookie){
                const authSignature = new Authentication();
                const refreshTokenValue = refreshJWTCookie['refreshToken']
                const refreshString = process.env.REFRESH_SECRET_CIPHER
                const refreshToken = await authSignature.verifyToken(refreshTokenValue,refreshString,next)
                if(refreshToken){
                    const authSignature = new Authentication();
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
            */
            const sessionRefreshToken = req.session.token
            const isLoggedIn = req.session.isLoggedIn
            const cookieExpiry = new Date(req.session.cookie._expires);
            if (isLoggedIn && sessionRefreshToken){
                const authSignature = new Authentication();
                const refreshString = process.env.REFRESH_SECRET_CIPHER
                const refreshToken = await authSignature.verifyToken(sessionRefreshToken,refreshString,next);
                if(refreshToken){
                    const user = req.session.cookie.user
                    const newToken = await authSignature.signJWTToken(user,next)
                    if (newToken) {
                        req.session.isLoggedIn = true
                        req.session.user = user
                        req.session.token = newToken['refreshToken']
                        res.status(StatusCodes.OK).send({token: newToken['accessToken']})
                    }
                }
            }
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- ${Auth.name} -> postRefreshToken Method Called ->\n`)
            Auth.__selfEnd__()
        }
    }
}
export default Auth;