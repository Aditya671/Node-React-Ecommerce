import { StatusCodes } from "http-status-codes"

class Auth{

    postLogin(req,res,next){
        try{

            res.status(StatusCodes.OK).send({'':''})
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- Auth -> postLogin Method Called ->\n')
        }
    }
    postRegister(req,res,next){
        try{

            res.status(StatusCodes.OK).send({'':''})
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- Auth -> postRegister Method Called ->\n')
        }        
    }
    postLogout(req,res,next){
        try{
            
            res.status(StatusCodes.OK).send({'':''})    
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- Auth -> postLogout Method Called ->\n')
        }     
    }
}
export default Auth;