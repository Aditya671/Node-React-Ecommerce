import { StatusCodes } from "http-status-codes";
import {ValidationError} from "../../handlers/exceptions/ValidationError.js";
import ServerError from "../../handlers/exceptions/ServerError.js";
import usersSchema from "../../models/users/index.js";

class UsersController{
    constructor(){
        this.className = "Users"
    }
    static __selfStart__(){
        console.log(`\n----- ${this.name} -> Start \n`);
    }
    static __selfEnd__(){
        console.log(`\n----- ${this.name} -> End \n`);
    }
    getUserDetailsById = async (req,res,next) =>{
        try{
            UsersController.__selfStart__()
            const userId = req.params['userId'];
            if(userId){
                const userExist = usersSchema.exists({userId:userId})
                if(userExist){
                    usersSchema.findOne({userId}).select(['-__v','-password'])
                    .then((doc) => 
                    doc ? res.status(StatusCodes.OK).send(doc) : 
                        res.status(StatusCodes.OK).send({msg:"No Record Found"})
                    ).catch((err) => {
                        throw new ServerError("Query Error",err)
                    })
                }else
                    throw new ServerError("User does not exist",err)

            }else{
                throw new ValidationError("UserId missing","Please Provide user id")
            }
        }catch(err){
            next(err)
        }finally{
            UsersController.__selfEnd__()
        }
    }
}

export default UsersController;