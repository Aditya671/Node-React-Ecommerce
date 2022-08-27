import express from "express";
import ProductsController from "../../controllers/products/index.js";
import Authentication from "../../middleware/authentication.js";

const authenticationReq = new Authentication();
const products = new ProductsController();
const router = express.Router();

router.get('/products/', authenticationReq.tokenExistsInRequest,
    products.getAllProducts);
router.get('/products/:productId', authenticationReq.tokenExistsInRequest,
    products.getProductDetailsById);

export default router;