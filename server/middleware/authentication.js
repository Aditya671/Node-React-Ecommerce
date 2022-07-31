import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateSecketCipher } from "./cipher-text.js"
import  {ValidationError} from "../handlers/exceptions/ValidationError.js";


class Authentication{
    constructor(){
        this.secretJWTKey = generateSecketCipher()
    }
    static __self__(){
        return console.log('\n -----> Authentication Signature -> \n')
    }
    async signJWTToken(data,next){
        try{
            const token = jwt.sign(data,generateSecketCipher(),{expiresIn:process.env.JWT_LIETIME})
            if (token) return token
            else ValidationError("Issue with signing token");
        }
        catch(err){
            next(err)
        }
        finally{
            console.log('\n----- Authentication -> signJWTToken Method Called ->\n')
        }
    }
    async verifyToken(req,res,next){
        try{
            const token  = req.header.authentication.split(" ")[1]
            const isVerifed = jwt.verify(token,generateSecketCipher())
            if (isVerifed) return token
            else ValidationError("Token Invalid")
        }catch(err){
            next(err)

        }finally{
            console.log('\n----- Authentication -> verifyToken Method Called ->\n')
        }
    }
}
export default Authentication;