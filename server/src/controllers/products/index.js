import { StatusCodes } from "http-status-codes";
import {ValidationError} from "../../handlers/exceptions/ValidationError.js";
import ServerError from "../../handlers/exceptions/ServerError.js";
import productsSchema from "../../models/products/index.js";
import { DOES_NOT_EXIST, INVALID_QUERY, NO_DATA, VALUE_MISSING } from "../../utils/constants.js";

class ProductsController{
    constructor(){
        this.className = "Products"
    }
    static __selfStart__(){
        console.log(`\n----- ${this.name} -> Start \n`);
    }
    static __selfEnd__(){
        console.log(`\n----- ${this.name} -> End \n`);
    }
    /* GET a Single Products*/
    getProductDetailsById = async (req,res,next) =>{
        try{
            ProductsController.__selfStart__()
            const productId = req.params['productId'];
            if(productId){
                const productExist = productsSchema.exists({productId:productId})
                if(productExist){
                    productsSchema.findOne({productId: productId})
                    .then((doc) => 
                    doc ? res.status(StatusCodes.OK).send(doc) : 
                        res.status(StatusCodes.OK).send({msg:NO_DATA})
                    ).catch((err) => {
                        throw new ServerError(INVALID_QUERY,err)
                    })
                }else
                    throw new ServerError(DOES_NOT_EXIST.replace(/{item}/,"Product"),err)

            }else{
                throw new ValidationError(VALUE_MISSING,PROVIDE_VALUE.replace(/{value}/,"Product Id"))
            }
        }catch(err){
            next(err)
        }finally{
            ProductsController.__selfEnd__()
        }
    }
    /* GET all Products*/
    getAllProducts = async (req,res,next) =>{
        try{
            ProductsController.__selfStart__();
            const limit = req?.query['limit'] ? req?.query['limit'] : 20; 
            const skip = req?.query['skip'] ? req?.query['skip'] : 0;
            const productsMap = {}
            const productsList  = await productsSchema.find().limit(parseInt(limit)).skip(parseInt(skip))
            productsList.map(product => {
                productsMap[product._id] = product
            })
            if(productsList){
                res.status(StatusCodes.OK).send(productsMap);
            }else{
                res.status(StatusCodes.OK).send([]);
            }
        }catch(err){
            next(err)
        }finally{
            ProductsController.__selfEnd__()
        }
    }
}

export default ProductsController;