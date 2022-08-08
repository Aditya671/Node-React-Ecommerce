import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateSecketCipher } from "./cipher-text.js"
import { ValidationError } from "../handlers/exceptions/ValidationError.js";


class Authentication {
    constructor() {
        this.secretJWTKey = generateSecketCipher()
    }
    static __self__() {
        return console.log('\n -----> Authentication Signature -> \n')
    }
    async signJWTToken(data, next) {
        try {
            const accessString = process.env.ACCESS_SECRET_CIPHER
            const refreshString = process.env.REFRESH_SECRET_CIPHER
            const accessToken = await jwt.sign(data, generateSecketCipher(accessString), { expiresIn: process.env.ACCESS_JWT_LIETIME })
            const refreshToken = await jwt.sign(data, generateSecketCipher(refreshString), { expiresIn: process.env.REFRESH_JWT_LIFETIME })
            if (token) 
                return {
                    'accessToken':accessToken,
                    'refreshToken':refreshToken,
                }
            else new ValidationError("Issue with signing token");
        }
        catch (err) {
            next(err)
        }
        finally {
            console.log('\n----- Authentication -> signJWTToken Method Called ->\n')
        }
    }
    async verifyAccessToken(tokenValue, next){
        try{
            const accessString = process.env.ACCESS_SECRET_CIPHER
            
            const isVerifed = await verifyToken(tokenValue,accessString)
            return isVerifed
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- Authentication -> verifyAccessToken Method Called ->\n') 
        }
    }
    async verifyRefreshToken(tokenValue, next){
        try{
            const refreshString = process.env.REFRESH_SECRET_CIPHER
            const isVerifed = await verifyToken(tokenValue,refreshString)
            return isVerifed
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- Authentication -> verifyRefreshToken Method Called ->\n') 
        }
    }
    async verifyToken(tokenValue,tokenString) {
        try {
            const isVerifed = jwt.verify(tokenValue, generateSecketCipher(tokenString))
            if (isVerifed) return token
            else new ValidationError("Token Invalid")
        } catch (err) {
            next(err)

        } finally {
            console.log('\n----- Authentication -> verifyToken Method Called ->\n')
        }
    }
}
export default Authentication;