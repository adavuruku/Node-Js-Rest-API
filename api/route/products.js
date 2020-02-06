//servlet - takes care of request and reponse

//request for express framework
const express = require('express');
const router = express.Router();

//file upload settings
const multer = require('multer');

//cb - call back
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString()+ file.originalname);
    }
});
//const upload = multer({dest: 'uploads/'});

const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='mage/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

//this where upload is done 
const upload = multer({
    storage: storage,
    limits: {
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

/*use the product table model*/

const Product = require('../models/product');

//authentication file
const checkAuth = require ('../middleware/check-auth');

//bring in orders controller
const ProductsControllers = require('../controllers/products');

router.get('/',checkAuth,ProductsControllers.products_all_product);

//route settings if token is comng with request body
//router.post('/', upload.single('productImage'), checkAuth, (req,res,next)=>{

//route settings if token is coming as header - authorization
router.post('/', checkAuth, upload.single('productImage'),  ProductsControllers.products_new_product);
//retrieve a product
router.get('/:productId',checkAuth, ProductsControllers.products_get_product);
//update a product
router.patch('/:productId',checkAuth, ProductsControllers.products_update_product);

//delete a product
router.delete('/:productId', checkAuth, ProductsControllers.products_delete_product);

//export the servlet to the server
module.exports = router;