import express  from "express";
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
    async getUserDetailsById(req,res,next){
        try{
            Users.__selfStart__()
            const {userId} = req.params('userId');
            if(userId){
                const userExist = usersSchema.findOne({userId}).exec()
                .then((user) => {
                    user.collection.find({userId}).project({_id:0})
                }).catch(err => {
                    throw new ServerError("user does not exist",err)
                })

            }else{
                throw new ServerError("UserId missing","Please Provide user id")
            }
        }catch(err){
            next(err)
        }finally{
            Users.__selfEnd__()
        }
    }
}

export default UsersController;