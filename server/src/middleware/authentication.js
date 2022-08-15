import jwt from "jsonwebtoken"
import { generateSecketCipher } from "./cipher-text.js"
import { ValidationError } from "../handlers/exceptions/ValidationError.js";
import { UnAuthorizedAccess } from "../handlers/exceptions/UnAuthorizedAccess.js";
import { ENTER_TOKEN, INVALID_TOKEN } from "../utils/constants.js";


class Authentication {
    constructor() {
        this.secretJWTKey = generateSecketCipher
        this.className = "Authentication"
    }
    static __self__() {
        return console.log(`\n -----> ${this.name} -> \n`)
    }
    signJWTToken = async (data = {}, next) => {
        try {
            const accessString = process.env.ACCESS_SECRET_CIPHER
            const refreshString = process.env.REFRESH_SECRET_CIPHER
            const accessToken = await jwt.sign(data, this.secretJWTKey(accessString), { expiresIn: process.env.ACCESS_JWT_LIETIME })
            const refreshToken = await jwt.sign(data, this.secretJWTKey(refreshString), { expiresIn: process.env.REFRESH_JWT_LIFETIME })
            if (accessToken && refreshToken) 
                return {
                    'accessToken':accessToken,
                    'refreshToken':refreshToken
                }
            else throw new ValidationError("Issue with signing token");
        }
        catch (err) {
            next(err)
        }
        finally {
            console.log(`\n----- ${this.className} -> signJWTToken Method Called ->\n`)
        }
    }
    tokenExistsInRequest = async (req,res,next) => {
        try{
            const token = req.headers[`authorization`]
            const bearerToken = token.split(` `)[1];
            if(!bearerToken || !token.startsWith(`Bearer`)){
                throw new UnAuthorizedAccess(INVALID_TOKEN,ENTER_TOKEN)
            }else{
                const accessString = process.env.ACCESS_SECRET_CIPHER
                const validateToken = await this.verifyToken(bearerToken,accessString,next);
                return validateToken
            }
        }catch(err){
            next(err)
        }finally{
            console.log(`\n----- ${this.className} -> tokenExistsInRequest Method Called ->\n`)
        }
    }
    verifyToken = async (tokenValue,tokenString,next) => {
        try {
            const verifier = this.secretJWTKey(tokenString)
            const isVerifed = await jwt.verify(tokenValue,verifier )
            if (isVerifed) return token
            else throw new ValidationError(INVALID_TOKEN,ENTER_TOKEN)
        } catch (err) {
            next(err)

        } finally {
            console.log(`\n----- ${this.className} -> verifyToken Method Called ->\n`)
        }
    }
}
export default Authentication;