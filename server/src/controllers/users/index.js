import { StatusCodes } from "http-status-codes";
import {ValidationError} from "../../handlers/exceptions/ValidationError.js";
import ServerError from "../../handlers/exceptions/ServerError.js";
import usersSchema from "../../models/users/index.js";
import { DOES_NOT_EXIST, INVALID_QUERY, NO_DATA, PROVIDE_VALUE, VALUE_MISSING } from "../../utils/constants.js";

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
                        res.status(StatusCodes.OK).send({msg:NO_DATA})
                    ).catch((err) => {
                        throw new ServerError(INVALID_QUERY,err)
                    })
                }else
                    throw new ServerError(DOES_NOT_EXIST.replace(/{item}/i,'User'),err)

            }else{
                throw new ValidationError(VALUE_MISSING.replace(/{value}/i,'User id'),PROVIDE_VALUE.replace(/{value}/i,'user id'))
            }
        }catch(err){
            next(err)
        }finally{
            UsersController.__selfEnd__()
        }
    }
}

export default UsersController;