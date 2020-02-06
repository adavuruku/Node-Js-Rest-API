const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_all_product =(req,res,next)=>{
    Product.find().select('name price _id productImage').exec()
    .then(doc =>{
        const response={
            count: doc.length,
            products: doc.map(doc=>{
                return {
                    myId : doc._id,
                    myWorth:doc.price,
                    myTitle: doc.name,
                    myFile:doc.productImage,
                    request :{
                        type:"GET",
                        url:"http://localhost:3000/products/" + doc._id
                    }
                }
                
            })
        };
        //console.log(response);
        if(doc){
            res.status(200).json(response);
        }else{
            res.status(200).json({message: 'No Records In PRODUCTS table'});
        }
        
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_get_product =(req,res,next)=>{
    var id = req.params.productId;
    Product.findById(id).exec() //u can remove the select keyword to select all columns
    .then(doc =>{ 
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).json({message: 'Product Does nOT eXIST'});
        }
        
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_new_product =(req,res,next)=>{  
    const product = new Product({
        _id : mongoose.Types.ObjectId(),
        name :req.body.name,
        price :req.body.price,
        productImage:req.file.path
    });
    product.save()
    .then(result=> {
        console.log(result);
        res.status(201).json({
            message: 'New Product Created !!',
            product : product
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(404).json({
            message: 'OOps Faill To Create New Product !!',
            error:err
        });
    });
}

exports.products_update_product = (req,res,next)=>{
    var id = req.params.productId;
    Product.update({_id:id},{$set:{name:req.body.name, price:req.body.price}}).exec()
    .then(result=> {
        //console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.products_delete_product = (req,res,next)=>{
    var id = req.params.productId;
    Product.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}