
import Joi from "joi"

class usersValidator{

    static __self__(){
        return console.log('\n----- Validator -> AuthValidator ->\n');
    }
    validateUserSchema(fieldsObj){
        try{
            usersValidator.__self__()
            const isValid = Joi.object({
                userId:Joi.string().id().required(),
                username:Joi.string().min(6).max(20).required(),
                age:Joi.number().required(),
                title:Joi.string().valid('Mr.','Mrs.','Miss','Master','Others').required(),
                firstName:Joi.string().required().regex(/\w/),
                lastName:Joi.string().required().regex(/\w/),
                phone:Joi.string().required().regex(/^\d{10}$/),
                email:Joi.string().email({minDomainSegments:4,tlds:{allow:['net','com','co','ai']}}).required(),
                currentLocation:Joi.string().required(),
                profileImage:Joi.string().required(),
                gender:Joi.string().valid('Male','Female','Others'),
                address:Joi.string().required(),
                city:Joi.string().required(),
                country:Joi.string().required(),
                // country:Joi.string().custom(value,helper => {
                //    return helper.message('This country is not supported')
                // }).required(),
                countryCode:Joi.string().required(),
            })
            return isValid.validate(fieldsObj);
        }catch(err){
            next(err)
        }finally{
            console.log('\n----- userSchemaValidator -> validateUserSchema ->\n')
        }
    }
}
export default usersValidator;
